create table "public"."streamers" (
    "id" uuid not null default gen_random_uuid(),
    "broadcaster_id" text not null,
    "login_name" text,
    "profile_image" text,
    "stream_online" boolean not null,
    "stream_offline" boolean not null,
    "title" text,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "stream_status" boolean not null,
    "subscribed" boolean not null
);


alter table "public"."streamers" enable row level security;

create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "broadcaster_id" text,
    "created_at" text,
    "method" text,
    "login_name" text,
    "subscription_id" text,
    "subscription_type" text,
    "user_id" uuid
);


alter table "public"."subscriptions" enable row level security;

create table "public"."testing" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "test" text,
    "user_id" uuid
);


alter table "public"."testing" enable row level security;

CREATE UNIQUE INDEX streamers_broadcaster_id_key ON public.streamers USING btree (broadcaster_id);

CREATE UNIQUE INDEX streamers_pkey ON public.streamers USING btree (id, broadcaster_id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX testing_pkey ON public.testing USING btree (id);

alter table "public"."streamers" add constraint "streamers_pkey" PRIMARY KEY using index "streamers_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."testing" add constraint "testing_pkey" PRIMARY KEY using index "testing_pkey";

alter table "public"."streamers" add constraint "streamers_broadcaster_id_key" UNIQUE using index "streamers_broadcaster_id_key";

alter table "public"."streamers" add constraint "streamers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."streamers" validate constraint "streamers_user_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_broadcaster_id_fkey" FOREIGN KEY (broadcaster_id) REFERENCES streamers(broadcaster_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_broadcaster_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."testing" add constraint "testing_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."testing" validate constraint "testing_user_id_fkey";

create policy "Enable insert for users based on user_id"
on "public"."streamers"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for  users based on their userId"
on "public"."streamers"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Update access base on user id"
on "public"."streamers"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


create policy "Enable delete for users based on user_id"
on "public"."subscriptions"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for users based on user_id"
on "public"."subscriptions"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Enable read for users based on user_id"
on "public"."subscriptions"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Enable read access for all users"
on "public"."testing"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "enable insert"
on "public"."testing"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));



