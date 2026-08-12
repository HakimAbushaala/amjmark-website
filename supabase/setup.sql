-- Run this in the Supabase SQL Editor AFTER `npm run db:migrate` has created
-- the app tables (profiles, products, orders, ...) from prisma/schema.prisma.

-- 1) Auto-create a profiles row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, "fullName")
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Storage bucket for uploaded/composited gang-sheet print files.
-- Public so admin download links and cart thumbnails work without signed
-- URLs — these are artwork files, not sensitive personal data.
insert into storage.buckets (id, name, public)
values ('designs', 'designs', true)
on conflict (id) do nothing;

-- 3) Promote your own account to admin AFTER you've signed up once through
-- the site (run this manually, replacing the email):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
