export async function up(sql) {
  await sql`
    ALTER TABLE requests
    ADD apartment_id integer REFERENCES apartments(id) ON DELETE CASCADE
  `;
}

export async function down(sql) {
  await sql`
    ALTER TABLE requests
    DROP COLUMN apartment_id;
  `;
}
