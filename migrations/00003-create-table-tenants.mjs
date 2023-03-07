export async function up(sql) {
  await sql`
  CREATE TABLE tenants (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(80) NOT NULL UNIQUE,
    password varchar(70) NOT NULL,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    avatar text
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE tenants
  `;
}
