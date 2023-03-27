export async function up(sql) {
  await sql`
  CREATE TABLE tenants (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(80) NOT NULL UNIQUE,
    password varchar(70) NOT NULL,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    apartment_id integer REFERENCES apartments(id) ON DELETE CASCADE,
    avatar text,
    mail varchar(70),
    since varchar(70),
    birthday varchar(40)
  )`;
}

export async function down(sql) {
  await sql`DROP TABLE tenants`;
}
