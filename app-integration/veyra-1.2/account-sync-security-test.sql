-- Replace TEST_USER_ID with an existing fixture account entitled to investments.
-- Run only in a controlled verification session. All fixture records roll back.

begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','TEST_USER_ID',true);
do $$
declare r public.veyra_sync_records;
begin
 r:=public.veyra_sync_write('academy_favorites','__sync_security_probe__','{"content_id":"qa"}',0,false);
 if r.revision<>1 then raise exception 'bad initial revision'; end if;
 r:=public.veyra_sync_write('academy_favorites','__sync_security_probe__','{"content_id":"qa2"}',1,false);
 if r.revision<>2 then raise exception 'bad update revision'; end if;
 begin
  perform public.veyra_sync_write('academy_favorites','__sync_security_probe__','{}',1,false);
  raise exception 'stale write accepted';
 exception when serialization_failure then null; end;
 r:=public.veyra_sync_write('academy_favorites','__sync_security_probe__','{}',2,true);
 if not r.deleted or r.revision<>3 then raise exception 'bad tombstone'; end if;
 r:=public.veyra_sync_write('investment_favorites','__sync_security_probe__','{"symbol":"BTC"}',0,false);
 begin
  insert into public.veyra_feature_access(user_id,feature) values(auth.uid(),'investments');
  raise exception 'self grant accepted';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000123',true);
do $$ begin
 if exists(select 1 from public.veyra_sync_records where record_id='__sync_security_probe__') then raise exception 'cross user read'; end if;
 begin
  perform public.veyra_sync_write('price_rules','__sync_security_probe__','{}',0,false);
  raise exception 'unauthorized investment write';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: own writes, revisions, stale rejection, tombstones, investment entitlement, no self-grant, cross-user isolation' as result,
not has_table_privilege('anon','public.veyra_sync_records','SELECT') as anon_denied,
not has_function_privilege('anon','public.veyra_sync_write(text,text,jsonb,bigint,boolean)','EXECUTE') as anon_rpc_denied;
rollback;