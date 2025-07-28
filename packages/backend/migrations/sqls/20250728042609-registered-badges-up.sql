create table if not exists registered_badges
(
    id    text primary key,
    mac text
        constraint registered_badges_mac_address_unique
            unique,
    last_seen_at timestamp with time zone default now() not null,
    created_at  timestamp with time zone default now() not null,
    updated_at  timestamp with time zone default now() not null,
    deleted_at  timestamp with time zone default now() not null
);

create index if not exists idx_registered_badges_mac_address
    on registered_badges (mac);

create table if not exists registered_badges_version_downloads
(
    id                  serial
        primary key,
    registered_badge_id text not null
        constraint registered_badges_version_downloads_registered_badge_id_fk
            references registered_badges (id)
            on delete cascade,
    version_id          integer                                not null
        constraint registered_badges_version_downloads_version_id_fk
            references versions (id)
            on delete cascade,
    download_count     bigint                   default 0 not null,
    created_at          timestamp with time zone default now() not null,
    updated_at          timestamp with time zone default now() not null,
    deleted_at          timestamp with time zone default now() not null
);

create index if not exists idx_registered_badges_version_downloads_registered_badge_id
    on registered_badges_version_downloads (registered_badge_id);
create index if not exists idx_registered_badges_version_downloads_version_id
    on registered_badges_version_downloads (version_id);

create unique index if not exists idx_registered_badges_version_downloads_unique
    on registered_badges_version_downloads (registered_badge_id, version_id);