import { cache } from 'react';
import { sql } from './connect';

type Session = {
  id: number;
  token: string;
  csrfSecret: string;
};

export const createTenantSession = cache(
  async (token: string, userId: number, csrfSecret: string) => {
    const [session] = await sql<{ id: number; token: string }[]>`
    INSERT INTO tenantsessions
      (token, user_id, csrf_secret)
    VALUES
      (${token}, ${userId}, ${csrfSecret})
    RETURNING
      id,
      token
  `;
    await deleteExpiredSessions();
    return session;
  },
);

export const deleteExpiredSessions = cache(async () => {
  await sql`
    DELETE FROM
      tenantsessions
    WHERE
      expiry_timestamp < now()
  `;
});

export const deleteSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    DELETE FROM
      tenantsessions
    WHERE
      sessions.token = ${token}
    RETURNING
      id,
      token
  `;
  return session;
});

export const getValidSessionByToken = cache(async (token: string) => {
  const [session] = await sql<Session[]>`
    SELECT
      tenantsessions.id,
      tenantsessions.token,
      tenantsessions.csrf_secret
    FROM
      tenantsessions
    WHERE
      tenantsessions.token = ${token}
    AND
      tenantsessions.expiry_timestamp > now()
  `;
  return session;
});
