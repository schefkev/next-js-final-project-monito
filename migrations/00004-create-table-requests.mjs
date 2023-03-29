export async function up(sql) {
  await sql`
  CREATE TABLE requests (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tenant_id integer REFERENCES tenants(id) ON DELETE CASCADE,
    message text,
    picture text,
    created_at timestamp NOT NULL DEFAULT NOW(),
    apartment_id integer REFERENCES apartments(id) ON DELETE CASCADE,
    comment text,
    status boolean DEFAULT FALSE
  )`;
}

export async function down(sql) {
  await sql`DROP TABLE requests`;
}
