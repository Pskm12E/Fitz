create table wardrobe_items (
  id text primary key,
  user_id text not null default 'demo_user',
  name text not null,
  category text not null,
  color text,
  style text[],
  weather text[],
  formality text,
  image_url text not null,
  created_at timestamp with time zone default now()
);

create table marketplace_items (
  id text primary key,
  name text not null,
  category text not null,
  color text,
  style text[],
  price numeric not null,
  image_url text not null,
  buy_url text not null,
  created_at timestamp with time zone default now()
);

grant select on table wardrobe_items to anon, authenticated;
grant select on table marketplace_items to anon, authenticated;

alter table wardrobe_items enable row level security;
alter table marketplace_items enable row level security;

create policy "wardrobe items are readable"
on wardrobe_items
for select
to anon, authenticated
using (true);

create policy "marketplace items are readable"
on marketplace_items
for select
to anon, authenticated
using (true);
