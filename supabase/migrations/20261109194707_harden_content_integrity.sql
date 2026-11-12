begin;

-- Server validation is backed by database constraints, including direct Data API calls.
alter table public.home_content
  add constraint home_title_not_blank check (btrim(hero_title) <> ''),
  add constraint home_hero_alt_required check (hero_image_url = '' or btrim(hero_image_alt) <> ''),
  add constraint home_intro_alt_required check (intro_image_url = '' or btrim(intro_image_alt) <> '');
alter table public.history_sections
  add constraint history_title_body_not_blank check (btrim(title) <> '' and btrim(content) <> ''),
  add constraint history_alt_required check (image_url = '' or btrim(image_alt) <> '');
alter table public.temple_objects
  add constraint object_name_body_not_blank check (btrim(name) <> '' and btrim(description) <> ''),
  add constraint object_alt_required check (image_url = '' or btrim(image_alt) <> ''),
  add constraint object_private_media_only check (image_url not like 'reference/%');
alter table public.gallery_items
  add constraint gallery_title_category_not_blank check (btrim(title) <> '' and btrim(category) <> ''),
  add constraint gallery_type_fields_consistent check (
    (media_type = 'photo' and video_url = '' and thumbnail_url = '' and btrim(image_alt) <> '') or
    (media_type = 'video' and media_url = '' and storage_path is null and
      (thumbnail_url = '' or btrim(image_alt) <> ''))
  ),
  add constraint gallery_private_media_only check (
    media_url not like 'reference/%' and thumbnail_url not like 'reference/%'
  );
alter table public.virtual_tour_settings
  add constraint tour_title_not_blank check (btrim(title) <> ''),
  add constraint tour_cover_alt_required check (cover_image_url = '' or btrim(cover_image_alt) <> '');
alter table public.about_content
  add constraint about_title_not_blank check (btrim(title) <> ''),
  add constraint about_alt_required check (image_url = '' or btrim(image_alt) <> '');
alter table public.contributors
  add constraint contributor_name_not_blank check (btrim(name) <> ''),
  add constraint contributor_alt_required check (image_url = '' or btrim(image_alt) <> ''),
  add constraint contributor_private_media_only check (image_url not like 'reference/%');
alter table public.site_settings
  add constraint site_name_not_blank check (btrim(site_name) <> '');

-- Align text limits with forms. No user content is rewritten or discarded here.
do $$
declare c record; max_length integer;
begin
  for c in
    select table_name, column_name from information_schema.columns
    where table_schema = 'public' and data_type = 'text'
      and table_name in ('admin_users','site_settings','home_content','history_sections',
        'temple_objects','gallery_items','virtual_tour_settings','about_content','contributors')
  loop
    max_length := case when c.column_name like '%description'
      or c.column_name in ('content','summary','background','purpose','benefits',
        'source_note','hero_subtitle','cultural_value') then 20000 else 500 end;
    execute format('alter table public.%I add constraint %I check (length(%I) <= %s)',
      c.table_name, c.table_name || '_' || c.column_name || '_length', c.column_name, max_length);
  end loop;
end $$;

-- Config forms support upsert, never deletion/reset of the site's singleton records.
revoke delete on public.site_settings, public.home_content,
  public.about_content, public.virtual_tour_settings from authenticated;
drop policy admin_delete on public.site_settings;
drop policy admin_delete on public.home_content;
drop policy admin_delete on public.about_content;
drop policy admin_delete on public.virtual_tour_settings;

comment on table public.site_settings is 'One public configuration record (id=1); contains no credentials.';
comment on table public.home_content is 'One homepage record (id=1). Public readers only see published content.';
comment on table public.history_sections is 'Ordered plain-text sections. Drafts are admin-only.';
comment on table public.temple_objects is 'Observed cultural objects. Publishing requires documentation approval.';
comment on table public.gallery_items is 'Approved photo/video metadata. Images use private Storage paths.';
comment on table public.virtual_tour_settings is 'One Pano2VR integration record (id=1), never panorama node data.';
comment on table public.about_content is 'One about page (id=1); contact details belong to site_settings.';
comment on table public.contributors is 'Real contributors only; publish identities after permission.';
commit;
