
create table public.veyra_feature_access (
 user_id uuid not null references auth.users(id) on delete cascade,
 feature text not null check(feature in ('investments')),
 enabled boolean not null default true,
 created_at timestamptz not null default now(),
 primary key(user_id,feature)
);
alter table public.veyra_feature_access enable row level security;
revoke all on public.veyra_feature_access from public,anon,authenticated;
grant select on public.veyra_feature_access to authenticated;
create policy feature_read_own on public.veyra_feature_access for select to authenticated using(user_id=(select auth.uid()));

create table public.veyra_sync_records (
 user_id uuid not null references auth.users(id) on delete cascade,
 collection text not null check(collection in ('academy_favorites','learning_progress','flight_log','pilot_profile','study_plan','medical_reminders','investment_favorites','price_rules')),
 record_id text not null check(length(record_id) between 1 and 180),
 payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=65536),
 revision bigint not null default 1 check(revision>0),
 deleted boolean not null default false,
 updated_at timestamptz not null default clock_timestamp(),
 primary key(user_id,collection,record_id)
);
alter table public.veyra_sync_records enable row level security;
revoke all on public.veyra_sync_records from public,anon,authenticated;
grant select,insert,update on public.veyra_sync_records to authenticated;
create policy sync_own on public.veyra_sync_records for all to authenticated
using(user_id=(select auth.uid()) and (collection not in ('investment_favorites','price_rules') or exists(select 1 from public.veyra_feature_access f where f.user_id=(select auth.uid()) and f.feature='investments' and f.enabled)))
with check(user_id=(select auth.uid()) and (collection not in ('investment_favorites','price_rules') or exists(select 1 from public.veyra_feature_access f where f.user_id=(select auth.uid()) and f.feature='investments' and f.enabled)));
create function public.veyra_sync_stamp() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if TG_OP='INSERT' then new.revision:=1;
 else
  if new.user_id<>old.user_id or new.collection<>old.collection or new.record_id<>old.record_id then raise exception 'immutable record identity'; end if;
  if new.revision<>old.revision+1 then raise exception 'sync_conflict' using errcode='40001'; end if;
 end if;
 new.updated_at:=clock_timestamp();
 return new;
end $$;
revoke all on function public.veyra_sync_stamp() from public,anon,authenticated;
create trigger veyra_sync_stamp before insert or update on public.veyra_sync_records for each row execute function public.veyra_sync_stamp();
create function public.veyra_sync_write(p_collection text,p_record_id text,p_payload jsonb,p_expected_revision bigint,p_deleted boolean default false)
returns public.veyra_sync_records language plpgsql security invoker set search_path='' as $$
declare result public.veyra_sync_records;
begin
 if auth.uid() is null then raise exception 'authentication_required' using errcode='42501'; end if;
 if p_expected_revision is null or p_expected_revision<0 then raise exception 'invalid_revision' using errcode='22023'; end if;
 if p_expected_revision=0 then
  insert into public.veyra_sync_records(user_id,collection,record_id,payload,deleted)
  values(auth.uid(),p_collection,p_record_id,p_payload,p_deleted)
  on conflict(user_id,collection,record_id) do nothing returning * into result;
 else
  update public.veyra_sync_records set payload=p_payload,deleted=p_deleted,revision=revision+1
  where user_id=auth.uid() and collection=p_collection and record_id=p_record_id and revision=p_expected_revision
  returning * into result;
 end if;
 if result.user_id is null then raise exception 'sync_conflict_or_unavailable' using errcode='40001'; end if;
 return result;
end $$;
revoke all on function public.veyra_sync_write(text,text,jsonb,bigint,boolean) from public,anon;
grant execute on function public.veyra_sync_write(text,text,jsonb,bigint,boolean) to authenticated;
grant all on public.veyra_feature_access,public.veyra_sync_records to service_role;
