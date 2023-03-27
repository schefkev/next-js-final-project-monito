export async function up(sql) {
  await sql`
  CREATE TABLE apartments (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    name varchar(100) NOT NULL,
    address varchar(100) NOT NULL,
    city varchar(70) NOT NULL,
    unit varchar(70) NOT NULL,
    zip varchar(70) NOT NULL,
    rent decimal(10,2) NOT NULL,
    occupied boolean DEFAULT FALSE,
    image TEXT
  )`;
}

export async function down(sql) {
  await sql`DROP TABLE apartments`;
}
