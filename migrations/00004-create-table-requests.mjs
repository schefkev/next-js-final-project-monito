export async function up(sql) {
  await sql`
  CREATE TABLE requests (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tenant_id integer REFERENCES tenants(id) ON DELETE CASCADE,
    message text,
    picture text
  )`;
}

export async function down(sql) {
  await sql`
  DROP TABLE requests
  `;
}
