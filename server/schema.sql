-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create a table for custom users (for JWT authentication)
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique,
  username text unique,
  password_hash text not null,
  role text default 'user'
);

-- Create a table for public profiles
create table profiles (
  id uuid references users(id) not null,
  company_name text,
  contact_phone text,
  billing_address text,

  primary key (id)
);

-- Create a table for menus
create table menus (
  id uuid primary key default uuid_generate_v4(),
  available_date date default CURRENT_DATE,
  stock_quantity integer default 100,
  dietary_tags text[],
  nutritional_info jsonb,
  category text not null,
  name text not null,
  price numeric not null,
  image text
);

-- Create a table for orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) not null,
  status text not null,
  total_price numeric not null,
  delivery_window_start timestamp with time zone not null,
  delivery_window_end timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Create a table for order items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) not null,
  menu_id uuid references menus(id) not null,
  quantity integer not null,
  unit_price numeric not null
);