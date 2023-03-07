import { cache } from 'react';
import { sql } from './connect';

export type TenantRequest = {
  id: number;
  landlord_id: number;
  address: string;
};

// Get all users
export const getTenantRequests = cache(async () => {
  const info = await sql<TenantRequest[]>`
    SELECT
    tenants.name AS tenant_name,
    requests.message AS request_message
    FROM
      tenant_requests
    INNER JOIN tenants
    ON tenants.id = tenant_requests.tenant_id
    INNER JOIN requests
    ON requests.id = tenant_requests.request_id;

  `;
  return info;
});
