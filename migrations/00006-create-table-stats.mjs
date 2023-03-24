export async function up(sql) {
  await sql`
  CREATE TABLE stats (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    apartment_id integer REFERENCES apartments(id) ON DELETE CASCADE,
    rent decimal(10,2) NOT NULL,
    mortgage decimal(10,2) NOT NULL,
    expense decimal(10,2) NOT NULL,
    month varchar(20)
  )`;
}

export async function down(sql) {
  await sql`DROP TABLE stats`;
}
