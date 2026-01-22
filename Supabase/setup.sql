create extension if not exists "uuid-ossp";

-- Create tickets table
create table tickets (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  description text not null,
  category text,
  sentiment text,
  processed boolean default false
);

-- Enable Row Level Security
alter table tickets enable row level security;

-- Allow public read access
create policy "Allow public read"
on tickets
for select
using (true);

-- Allow public insert access
create policy "Allow public insert"
on tickets
for insert
with check (true);

-- Allow public update access
create policy "Allow public update"
on tickets
for update
using (true);

create table notifications_log (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  ticket_id uuid not null,
  notification_type text not null,
  sentiment text,
  category text,
  status text default 'sent'
);

-- Habilitar RLS
alter table notifications_log enable row level security;

-- Allow public insert access
create policy "Allow public insert"
on notifications_log
for insert
with check (true);

-- Allow public read access
create policy "Allow public read"
on notifications_log
for select
using (true);