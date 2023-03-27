export async function up(sql) {
  await sql`
    ALTER TABLE apartments
    ADD tenant_id integer REFERENCES tenants(id) ON DELETE CASCADE
  `;
}

export async function down(sql) {
  await sql`
    ALTER TABLE apartments
    DROP COLUMN tenant_id;
  `;
}
