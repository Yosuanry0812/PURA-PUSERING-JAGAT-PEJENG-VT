-- Run as the project owner AFTER all migrations and seed. This script is read-only.
begin read only;
do $$
declare t text; n integer;
begin
  foreach t in array array['admin_users','site_settings','home_content','history_sections',
    'temple_objects','gallery_items','virtual_tour_settings','about_content','contributors'] loop
    if not exists(select 1 from pg_class c join pg_namespace s on s.oid=c.relnamespace
      where s.nspname='public' and c.relname=t and c.relrowsecurity) then
      raise exception 'Table missing or RLS disabled: %',t;
    end if;
    if has_table_privilege('anon',format('public.%I',t),'INSERT')
      or has_table_privilege('anon',format('public.%I',t),'UPDATE')
      or has_table_privilege('anon',format('public.%I',t),'DELETE') then
      raise exception 'Anonymous write privilege found: %',t;
    end if;
  end loop;
  if has_table_privilege('authenticated','public.admin_users','INSERT')
    or has_table_privilege('authenticated','public.admin_users','UPDATE')
    or has_table_privilege('authenticated','public.admin_users','DELETE') then
    raise exception 'Authenticated users must not manage admin membership';
  end if;
  foreach t in array array['site_settings','home_content','about_content','virtual_tour_settings'] loop
    execute format('select count(*) from public.%I where id=1',t) into n;
    if n<>1 then raise exception 'Seeded singleton missing: %',t; end if;
    if has_table_privilege('authenticated',format('public.%I',t),'DELETE') then
      raise exception 'Singleton deletion must be disabled: %',t;
    end if;
  end loop;
  if not exists(select 1 from pg_proc p join pg_namespace s on s.oid=p.pronamespace
    where s.nspname='private' and p.proname='is_admin' and p.prosecdef
      and p.proconfig is not null) then
    raise exception 'Restricted private admin helper missing';
  end if;
  if exists(select 1 from pg_proc p join pg_namespace s on s.oid=p.pronamespace
    where s.nspname='public' and p.proname in ('is_admin','media_referenced') and p.prosecdef) then
    raise exception 'Privileged CMS helper exposed in public schema';
  end if;
  if not exists(select 1 from storage.buckets where id='temple-media' and not public
    and file_size_limit=3145728 and allowed_mime_types @> array['image/jpeg','image/png','image/webp']) then
    raise exception 'Private media bucket configuration incorrect';
  end if;
  select count(*) from pg_policies where schemaname='storage' and tablename='objects'
    and policyname in ('temple_media_read','temple_media_insert','temple_media_update','temple_media_delete') into n;
  if n<>4 then raise exception 'Expected four CMS Storage policies, found %',n; end if;
  if exists(select 1 from public.gallery_items where status='published' and not publication_approved)
    or exists(select 1 from public.temple_objects where status='published' and not publication_approved) then
    raise exception 'Published content without approval';
  end if;
  raise notice 'CMS structural checks passed. Authenticated browser/RLS acceptance tests are still required.';
end $$;
rollback;
