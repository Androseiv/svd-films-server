create table "user"
(
    id             serial primary key,
    email          varchar(255),
    username       varchar(64),
    password       varchar(64),
    isActivated    boolean,
    activationLink varchar(255)
);

create table token
(
    user_id      integer references "user" (id),
    refreshToken varchar(255)
);

create table rated_film
(
    id      integer,
    time    timestamptz,
    user_id integer references "user" (id),
    rating  integer
);

create table favourite_film
(
    id      integer,
    time    timestamptz,
    user_id integer references "user" (id)
);

create table later_film
(
    id      integer,
    time    timestamptz,
    user_id integer references "user" (id)
);

create table rated_tv
(
    id      integer,
    title   varchar(255),
    time    timestamptz,
    user_id integer references "user" (id),
    rating  integer
);

create table favourite_tv
(
    id      integer,
    title   varchar(255),
    time    timestamptz,
    user_id integer references "user" (id)
);

create table later_tv
(
    id      integer,
    title   varchar(255),
    time    timestamptz,
    user_id integer references "user" (id)
);