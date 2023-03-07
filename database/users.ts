import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

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

// get all the users
export const getUsers = cache(async () => {
  const users = await sql<User[]>`
    SELECT * FROM users
  `;
  return users;
});

// get users by its id
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

// FIX THIS SECTION ACCORDINGLY
export async function isUserAdminBySessionToken(sessionToken: string) {
  // FIXME: Implement proper authorization
  console.log(sessionToken);
  return await true;
}
