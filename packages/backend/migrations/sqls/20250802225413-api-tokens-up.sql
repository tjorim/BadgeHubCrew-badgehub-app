create table if not exists project_api_key
(
    project_slug text primary key,
    key_hash     text                                   not null unique,
    created_at   timestamp with time zone default now() not null,
    last_used_at timestamp with time zone default now() not null
);