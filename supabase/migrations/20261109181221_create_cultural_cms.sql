begin;

-- Only the membership lookup elevates privileges; private is NOT an exposed API schema.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create domain public.media_path as text check (
  value = '' or value ~ '^(hero|history|gallery|objects|about|virtual-tour-cover)/[0-9a-f-]{36}\.(jpg|png|webp)$'
  or value in ('reference/split-gateway.webp','reference/main-gate.webp')
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (length(display_name) <= 120),
  role text not null default 'admin' check (role = 'admin'),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy admin_can_read_own_membership on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid()) and a.is_active and a.role = 'admin'
  );
$$;
revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null check (length(site_name) between 1 and 500),
  site_description text not null default '',
  logo_url public.media_path not null default '',
  favicon_url public.media_path not null default '',
  background_image_url public.media_path not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  location_text text not null default '',
  instagram_url text not null default '' check (instagram_url = '' or instagram_url ~ '^https://[^/@[:space:]]+(/[^[:space:]]*)?$'),
  facebook_url text not null default '' check (facebook_url = '' or facebook_url ~ '^https://[^/@[:space:]]+(/[^[:space:]]*)?$'),
  footer_description text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  updated_at timestamptz not null default now()
);
create table public.home_content (
  id smallint primary key default 1 check (id = 1),
  hero_title text not null check (length(hero_title) between 1 and 500),
  hero_subtitle text not null default '',
  hero_image_url public.media_path not null default '',
  hero_image_alt text not null default '',
  hero_cta text not null default 'Mulai Virtual Tour',
  history_cta text not null default 'Jelajahi Sejarah',
  intro_title text not null default '',
  intro_description text not null default '',
  intro_image_url public.media_path not null default '',
  intro_image_alt text not null default '',
  features_title text not null default '',
  heritage_title text not null default '', heritage_description text not null default '',
  architecture_title text not null default '', architecture_description text not null default '',
  archaeology_title text not null default '', archaeology_description text not null default '',
  spiritual_title text not null default '', spiritual_description text not null default '',
  mandala_title text not null default '',
  nista_description text not null default '', madya_description text not null default '', utama_description text not null default '',
  tour_title text not null default '', tour_description text not null default '',
  tour_cover_url public.media_path not null default '', tour_cta text not null default '',
  gallery_title text not null default '',
  conservation_title text not null default '', conservation_description text not null default '',
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.history_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 500),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  content text not null check (length(content) between 1 and 20000),
  summary text not null default '',
  image_url public.media_path not null default '', image_alt text not null default '',
  source_url text not null default '' check (source_url = '' or source_url ~ '^https://[^/@[:space:]]+(/[^[:space:]]*)?$'),
  source_note text not null default '',
  sort_order integer not null default 0 check (sort_order between 0 and 999999),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.temple_objects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 500),
  mandala text not null check (mandala in ('nista','madya','utama')),
  description text not null check (length(description) between 1 and 20000),
  function_description text not null default '', cultural_value text not null default '',
  image_url public.media_path not null default '', image_alt text not null default '',
  publication_approved boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0 check (sort_order between 0 and 999999),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint object_publication_requires_approval check (status <> 'published' or publication_approved)
);
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 500), description text not null default '',
  media_type text not null check (media_type in ('photo','video')),
  media_url public.media_path not null default '',
  video_url text not null default '', thumbnail_url public.media_path not null default '',
  image_alt text not null default '', storage_path public.media_path,
  category text not null check (length(category) between 1 and 500),
  temple_object_id uuid references public.temple_objects(id) on delete set null,
  is_featured boolean not null default false, publication_approved boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0 check (sort_order between 0 and 999999),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint gallery_publication_requires_approval check (status <> 'published' or publication_approved),
  constraint gallery_photo_valid check (media_type <> 'photo' or (media_url <> '' and image_alt <> '' and storage_path is not null and storage_path = media_url)),
  constraint gallery_video_valid check (media_type <> 'video' or video_url ~ '^https://(www\.)?(youtube\.com|youtu\.be|vimeo\.com)(/[^[:space:]]*)?$')
);
create table public.virtual_tour_settings (
  id smallint primary key default 1 check (id = 1),
  title text not null check (length(title) between 1 and 500), description text not null default '',
  tour_url text not null default '' check (tour_url = '' or tour_url ~ '^https://[a-zA-Z0-9.-]+(/[^[:space:]]*)?$'),
  cover_image_url public.media_path not null default '', cover_image_alt text not null default '',
  is_published boolean not null default false, updated_at timestamptz not null default now(),
  constraint tour_requires_url check (not is_published or tour_url <> '')
);
create table public.about_content (
  id smallint primary key default 1 check (id = 1),
  title text not null check (length(title) between 1 and 500), background text not null default '',
  purpose text not null default '', benefits text not null default '',
  image_url public.media_path not null default '', image_alt text not null default '',
  is_published boolean not null default false, updated_at timestamptz not null default now()
);
create table public.contributors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 500), role text not null default '', description text not null default '',
  image_url public.media_path not null default '', image_alt text not null default '',
  sort_order integer not null default 0 check (sort_order between 0 and 999999),
  is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index history_public_order on public.history_sections(status, sort_order, id);
create index history_recent on public.history_sections(updated_at desc);
create index objects_public_order on public.temple_objects(status, publication_approved, mandala, sort_order, id);
create index gallery_public_order on public.gallery_items(status, publication_approved, sort_order, id);
create index gallery_category_order on public.gallery_items(category, sort_order, id) where status = 'published' and publication_approved;
create index gallery_featured_order on public.gallery_items(sort_order, id) where status = 'published' and publication_approved and is_featured;
create index gallery_object_reference on public.gallery_items(temple_object_id);
create index contributors_public_order on public.contributors(is_published, sort_order, id);

create function private.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function private.touch_updated_at() from public, anon, authenticated;

do $$ declare t text; public_rule text; begin
  foreach t in array array['site_settings','home_content','history_sections','temple_objects','gallery_items','virtual_tour_settings','about_content','contributors'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from anon, authenticated',t);
    execute format('grant select on public.%I to anon, authenticated',t);
    execute format('grant insert, update, delete on public.%I to authenticated',t);
    public_rule := case
      when t = 'site_settings' then 'true'
      when t = 'history_sections' then 'status = ''published'''
      when t in ('temple_objects','gallery_items') then 'status = ''published'' and publication_approved'
      else 'is_published' end;
    execute format('create policy public_read on public.%I for select to anon, authenticated using (%s)',t,public_rule);
    execute format('create policy admin_read on public.%I for select to authenticated using ((select private.is_admin()))',t);
    execute format('create policy admin_insert on public.%I for insert to authenticated with check ((select private.is_admin()))',t);
    execute format('create policy admin_update on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))',t);
    execute format('create policy admin_delete on public.%I for delete to authenticated using ((select private.is_admin()))',t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function private.touch_updated_at()',t);
  end loop;
end $$;

-- SECURITY INVOKER: these lookups observe the caller's RLS, including draft visibility.
create function private.media_referenced(p text, published_only boolean default true) returns boolean
language sql stable security invoker set search_path = '' as $$
  select p <> '' and (
    exists(select 1 from public.site_settings where p in (logo_url, favicon_url, background_image_url)) or
    exists(select 1 from public.home_content where (not published_only or is_published) and p in (hero_image_url, intro_image_url, tour_cover_url)) or
    exists(select 1 from public.history_sections where (not published_only or status = 'published') and p = image_url) or
    exists(select 1 from public.temple_objects where (not published_only or (status = 'published' and publication_approved)) and p = image_url) or
    exists(select 1 from public.gallery_items where
      (not published_only and p in (media_url, thumbnail_url, storage_path)) or
      (published_only and status = 'published' and publication_approved and
        ((media_type = 'photo' and p = media_url) or (media_type = 'video' and p = thumbnail_url)))) or
    exists(select 1 from public.virtual_tour_settings where (not published_only or is_published) and p = cover_image_url) or
    exists(select 1 from public.about_content where (not published_only or is_published) and p = image_url) or
    exists(select 1 from public.contributors where (not published_only or is_published) and p = image_url)
  );
$$;
revoke all on function private.media_referenced(text, boolean) from public, anon, authenticated;
grant execute on function private.media_referenced(text, boolean) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('temple-media','temple-media',false,3145728,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy temple_media_read on storage.objects for select to anon, authenticated
using (bucket_id = 'temple-media' and ((select private.is_admin()) or private.media_referenced(name,true)));
create policy temple_media_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'temple-media' and (select private.is_admin()) and
  name ~ '^(hero|history|gallery|objects|about|virtual-tour-cover)/[0-9a-f-]{36}\.(jpg|png|webp)$'
);
create policy temple_media_update on storage.objects for update to authenticated
using (bucket_id = 'temple-media' and (select private.is_admin()) and not private.media_referenced(name,false))
with check (bucket_id = 'temple-media' and (select private.is_admin()) and not private.media_referenced(name,false) and name ~ '^(hero|history|gallery|objects|about|virtual-tour-cover)/[0-9a-f-]{36}\.(jpg|png|webp)$');
create policy temple_media_delete on storage.objects for delete to authenticated
using (bucket_id = 'temple-media' and (select private.is_admin()) and not private.media_referenced(name,false));

-- Distinct published categories without downloading the entire gallery.
create function public.gallery_categories() returns table(category text)
language sql stable security invoker set search_path = '' as $$
  select distinct g.category from public.gallery_items g
  where g.status = 'published' and g.publication_approved order by g.category;
$$;
revoke all on function public.gallery_categories() from public, anon, authenticated;
grant execute on function public.gallery_categories() to anon, authenticated;

comment on function private.is_admin() is 'Narrow SECURITY DEFINER lookup only. Membership writes are reserved for trusted database administrators.';
comment on column public.gallery_items.media_url is 'Private Storage path, never a public or signed URL.';
comment on column public.history_sections.content is 'Plain text only. Render escaped paragraphs; never execute HTML.';
commit;
