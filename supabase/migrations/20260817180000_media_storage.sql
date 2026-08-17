-- Phase 4: public delivery bucket with staff-only management.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "site media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
create policy "staff upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and (select private.is_staff()));
create policy "staff update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and (select private.is_staff())) with check (bucket_id = 'site-media' and (select private.is_staff()));
create policy "staff delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and (select private.is_staff()));
