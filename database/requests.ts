import { cache } from 'react';
import { sql } from './connect';

export type Request = {
  id: number;
  tenantId: number;
  message: string;
  picture: string;
};

/* ----- GET ALL THE REQUESTS ----- */
export const getRequests = cache(async () => {
  const requests = await sql<Request[]>`
    SELECT * FROM requests
  `;
  return requests;
});

/* ----- GET REQUEST BY ITS ID ----- */
export const getRequestById = cache(async (id: number) => {
  const [request] = await sql<Request[]>`
    SELECT
      *
    FROM
      requests
    WHERE
      id = ${id}
  `;
  return request;
});

/* ----- GET REQUEST BY TENANTS ID ----- */
export const getRequestByTenantId = cache(async (tenantId: number) => {
  const request = await sql<Request[]>`
    SELECT
      *
    FROM
      requests
    WHERE
      tenant_id = ${tenantId}
  `;
  return request;
});

/* ----- CREATE NEW REQUEST ----- */
export const createRequest = cache(
  async (tenantId: number, message: string, picture: string) => {
    const [request] = await sql<
      { id: number; tenant_id: number; message: string; picture: string }[]
    >`
    INSERT INTO requests
      (tenant_id, message, picture)
    VALUES
      (${tenantId}, ${message}, ${picture})
    RETURNING
      id,
      message,
      picture
    `;
    return request;
  },
);
