export async function up(sql) {
  await sql`
  CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(80) NOT NULL UNIQUE,
    password varchar(70) NOT NULL,
    avatar TEXT
  )
`;
}

export async function down(sql) {
  await sql`
  DROP TABLE users
`;
}
