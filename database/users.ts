import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

/* Expected: { id: number; userId: number; name: string; }[]`
	Actual: { id: number; userId: number | null; name: string; }[]  */

/* ----- GET THE USER BY THE SESSION TOKEN */
export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<
    { id: number; username: string; csrfSecret: string }[]
  >`
    SELECT
      users.id,
      users.username,
      sessions.csrf_secret
    FROM
      users
    INNER JOIN
      sessions ON (
        sessions.token = ${token} AND
        sessions.user_id = users.id AND
        sessions.expiry_timestamp > now()
      )
  `;
  return user;
});

/* ----- GET THE USER BY THE HASHED PASSWORD ----- */
export const getUserByUsernameWithPasswordHash = cache(
  async (username: string) => {
    const [user] = await sql<User[]>`
  SELECT
    *
  FROM
    users
  WHERE
    username = ${username}
  `;
    return user;
  },
);

/* ----- GET THE USER BY ITS USERNAME ----- */
export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<{ id: number; username: string }[]>`
  SELECT
    id,
    username
  FROM
    users
  WHERE
    username = ${username}
  `;
  return user;
});

/* ----- CREATE A NEW USER ----- */
export const createUser = cache(
  async (username: string, password: string, avatar: string) => {
    const [user] = await sql<
      { id: number; username: string; avatar: string }[]
    >`
  INSERT INTO users
    (username, password, avatar)
  VALUES
    (${username}, ${password}, ${avatar})
  RETURNING
    id,
    username,
    avatar
  `;
    return user;
  },
);

/* ----- GET ALL THE USERS ----- */
export const getUsers = cache(async () => {
  const users = await sql<User[]>`
    SELECT * FROM users
  `;
  return users;
});

/* ----- GET USER BY ITS ID ----- */
export const getUserById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }
  const [user] = await sql<User[]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user;
});

/* ----- GET USER WITH APARTMENTS ----- */
export const getUserWithApartments = cache(async (id: number) => {
  const user = await sql<{ id: number; userId: number; name: string }[]>`
    SELECT
      id, user_id, name
    FROM
      apartments
    WHERE
      apartments.user_id = ${id}
  `;
  return user;
});
