const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const {chromium} = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/playwright' : 'playwright');

(async () => {
  const files = new Set(['recuperar-app.html', 'recuperar-app.css', 'recuperar-app.js']);
  const server = http.createServer(async (req, res) => {
    const name = new URL(req.url, 'http://localhost').pathname.slice(1);
    if (!files.has(name)) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', name.endsWith('.js') ? 'text/javascript' : name.endsWith('.css') ? 'text/css' : 'text/html');
    res.end(await fs.readFile(path.join(__dirname, '..', name)));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/recuperar-app.html`;
  const browser = await chromium.launch({headless:true,executablePath:process.env.VEYRA_TEST_CHROMIUM,args:['--no-sandbox','--disable-dev-shm-usage']});
  const contexts=[];
  async function setup(fragment='', handler=()=>({status:200,body:{id:'test-user'}})) {
    const context=await browser.newContext({viewport:{width:390,height:844}}); contexts.push(context);
    const page=await context.newPage();
    const calls=[]; const errors=[];
    page.on('pageerror', error=>errors.push(error.message));
    await page.route('https://ogdncxrhdnnpphvuhvpf.supabase.co/**', async route=>{
      const req=route.request(); calls.push(req);
      const answer=handler(req);
      await route.fulfill({status:answer.status,contentType:'application/json',body:JSON.stringify(answer.body)});
    });
    await page.goto(base+fragment);
    return {page,calls,errors};
  }
  try {
    const request=await setup('',()=>({status:200,body:{}}));
    await request.page.locator('#email').fill('test@example.invalid');
    await request.page.locator('#request-button').click();
    await request.page.getByRole('heading',{name:'Revisa tu correo'}).waitFor();
    assert.equal(request.calls.length,1);
    assert.equal(new URL(request.calls[0].url()).searchParams.get('redirect_to'),'https://veyrapilot.com/recuperar-app.html');
    assert.deepEqual(request.calls[0].postDataJSON(),{email:'test@example.invalid'});
    assert.equal(request.calls[0].headers().authorization,undefined);
    assert.match(await request.page.locator('#intro').innerText(),/Si existe una cuenta/);
    await request.page.locator('#restart').click();
    assert.equal(await request.page.locator('#request-button').isDisabled(),true);

    for (const fragment of ['#error=access_denied&error_code=otp_expired','#type=recovery','#access_token=fake&type=signup','?code=unexpected']) {
      const bad=await setup(fragment);
      await bad.page.getByRole('heading',{name:'Solicita un nuevo enlace'}).waitFor();
      assert.equal(bad.calls.length,0);
      assert.equal(new URL(bad.page.url()).hash,'');
      assert.equal(new URL(bad.page.url()).search,'');
    }
    const expired=await setup('#type=recovery&access_token=fake',()=>({status:401,body:{}}));
    await expired.page.getByRole('heading',{name:'Solicita un nuevo enlace'}).waitFor();
    assert.equal(await expired.page.locator('#password-form').isVisible(),false);

    let putStatus=422;
    const valid=await setup('#type=recovery&access_token=test-token&refresh_token=test-refresh',req=>{
      if(req.method()==='PUT')return {status:putStatus,body:putStatus===200?{id:'test-user'}:{code:'weak_password'}};
      return {status:200,body:{id:'test-user'}};
    });
    await valid.page.getByRole('heading',{name:'Elige tu nueva contraseña'}).waitFor();
    assert.equal(new URL(valid.page.url()).hash,'');
    assert.equal(valid.calls[0].headers().authorization,'Bearer test-token');
    await valid.page.locator('#password').fill('Test-password-84!');
    await valid.page.locator('#confirmation').fill('Different-password!');
    await valid.page.locator('#password-button').click();
    assert.equal(valid.calls.filter(r=>r.method()==='PUT').length,0);
    assert.match(await valid.page.locator('#status').innerText(),/no coinciden/);
    await valid.page.locator('#confirmation').fill('Test-password-84!');
    await valid.page.locator('#password-button').click();
    await valid.page.getByText('Elige una contraseña más segura, con mayúsculas, minúsculas, números y símbolos.').waitFor();
    putStatus=200;
    await valid.page.locator('#password-button').click();
    await valid.page.getByRole('heading',{name:'Contraseña actualizada'}).waitFor();
    assert.equal(await valid.page.locator('#password').inputValue(),'');
    assert.equal(await valid.page.locator('#confirmation').inputValue(),'');
    assert.deepEqual(await valid.page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});
    assert.equal(await valid.page.locator('#password-form').isVisible(),false);
    assert.equal(valid.calls.filter(r=>r.method()==='PUT')[1].postDataJSON().password,'Test-password-84!');
    await valid.page.reload();
    await valid.page.getByRole('heading',{name:'Recuperar contraseña'}).waitFor();
    assert.equal(await valid.page.locator('#password-form').isVisible(),false);

    const limited=await setup('',()=>({status:429,body:{}}));
    await limited.page.locator('#email').fill('test@example.invalid');
    await limited.page.locator('#request-button').click();
    await limited.page.getByText('Has solicitado varios enlaces. Espera un minuto antes de volver a intentarlo.').waitFor();
    assert.equal(await limited.page.locator('#request-button').isDisabled(),true);

    const visual=await setup();
    await visual.page.screenshot({path:'/tmp/veyra-recovery-mobile.png',fullPage:true});
    assert.equal(await visual.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await visual.page.setViewportSize({width:1024,height:768});
    await visual.page.screenshot({path:'/tmp/veyra-recovery-tablet.png',fullPage:true});
    for(const x of [request,expired,valid,limited,visual])assert.deepEqual(x.errors,[]);
    console.log('PASS: request destination, no account enumeration, resend cooldown, expired/malformed links, verified session, password mismatch, weak-password response, save success, token cleanup, reload, rate limiting, mobile/tablet layout. All auth responses mocked; no real emails or passwords changed.');
  } finally {
    for(const context of contexts)await context.close();
    await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
