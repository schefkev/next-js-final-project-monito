import { cache } from 'react';
import { sql } from './connect';

export type Tenant = {
  id: number;
  name: string;
  email: string;
  apartment_id: number;
};

// Get all users
export const getTenants = cache(async () => {
  const tenants = await sql<Tenant[]>`
    SELECT * FROM tenants
  `;
  return tenants;
});

// Get tenants By Id

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
