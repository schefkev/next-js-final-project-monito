export async function up(sql) {
  await sql`
  CREATE TABLE tenantsessions (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      token varchar(110) NOT NULL UNIQUE,
      expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
			user_id integer REFERENCES tenants (id) ON DELETE CASCADE,
      csrf_secret varchar NOT NULL
  )
`;
}

export async function down(sql) {
  await sql`
  DROP TABLE tenantsessions
`;
}
