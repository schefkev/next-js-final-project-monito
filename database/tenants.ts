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
