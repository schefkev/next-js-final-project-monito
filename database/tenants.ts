import { cache } from 'react';
import { sql } from './connect';

export type Tenant = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

/* ----- GET THE USER BY THE SESSION TOKEN */
export const getTenantBySessionToken = cache(async (token: string) => {
  const [tenant] = await sql<
    { id: number; username: string; csrfSecret: string }[]
  >`
    SELECT
      tenants.id,
      tenants.username,
      tenantsessions.csrf_secret
    FROM
      tenants
    INNER JOIN
      tenantsessions ON (
        tenantsessions.token = ${token} AND
        tenantsessions.user_id = tenants.id AND
        tenantsessions.expiry_timestamp > now()
      )
  `;
  return tenant;
});

/* ----- GET ALL THE TENANTS ----- */
export const getTenants = cache(async () => {
  const tenants = await sql<Tenant[]>`
    SELECT * FROM tenants
  `;
  return tenants;
});

/* ----- GET THE TENANT BY ITS ID ----- */
export const getTenantsById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }
  const [tenant] = await sql<Tenant[]>`
    SELECT
      *
    FROM
      tenants
    WHERE
      id = ${id}
  `;
  return tenant;
});

/* ----- GET THE TENANT BY THE HASHED PASSWORD ----- */
export const getTenantByUsernameWithPasswordHash = cache(
  async (username: string) => {
    const [user] = await sql<Tenant[]>`
    SELECT
      *
    FROM
      tenants
    WHERE
      username = ${username}
    `;
    return user;
  },
);

/* ----- GET TENANT BY USERNAME ----- */
export const getTenantsByUsername = cache(async (username: string) => {
  const [tenant] = await sql<{ id: number; username: string }[]>`
  SELECT
    id,
    username
  FROM
    tenants
  WHERE
    username = ${username}
  `;
  return tenant;
});

/* ----- CREATE NEW TENANT ----- */
export const createTenant = cache(
  async (
    username: string,
    password: string,
    userId: number,
    avatar: string,
  ) => {
    const [tenant] = await sql<
      {
        id: number;
        username: string;
        password: string;
        user_id: number;
        avatar: string;
      }[]
    >`
      INSERT INTO tenants
        (username, password, user_id, avatar)
      VALUES
        (${username}, ${password}, ${userId}, ${avatar})
      RETURNING
        id,
        username,
        password,
        avatar
      `;
    return tenant;
  },
);

/* ----- GET THE TENANT WITH THE USER-ID ----- */
export const getTenantByUserId = cache(async (userId: number) => {
  const tenant = await sql<Tenant[]>`
    SELECT
      *
    FROM
      tenants
    WHERE
      user_id = ${userId}
  `;
  return tenant;
});

/* ----- GET TENANTS WITH APARTMENTS ----- */
export const getTenantsWithApartments = cache(async () => {
  const tenant = await sql<Tenant[]>`
  SELECT
    *
  FROM
    apartments
  INNER JOIN
    tenants
  ON
    apartments.tenant_id = tenants.id
  `;
  return tenant;
});
