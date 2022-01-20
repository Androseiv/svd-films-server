create table "user"
(
    id             serial primary key,
    email          varchar(255),
    username       varchar(64),
    password       varchar(64),
    isActivated    boolean,
    activationLink varchar(255)
);

create table user_photo
(
    user_id integer references "user" (id),
    path    varchar(255)
);

create table token
(
    user_id      integer references "user" (id),
    refreshToken varchar(255)
);

drop table rated_film;
drop table favourite_film;
drop table later_film;
drop table user_photo;

create table rated_film
(
    id      integer,
    title   varchar(255),
    time    timestamptz,
    user_id integer references "user" (id),
    rating  integer
);

create table favourite_film
(
    id      integer,
    title   varchar(255),
    time    timestamptz,
    user_id integer references "user" (id)
);

create table later_film
(
    id      integer,
    title   varchar(255),
    time    timestamptz,
    user_id integer references "user" (id)
);