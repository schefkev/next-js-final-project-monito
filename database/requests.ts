import { cache } from 'react';
import { sql } from './connect';

export type Request = {
  id: number;
  tenant_id: number;
  message: string;
  picture: string;
};

// Get all users
export const getRequests = cache(async () => {
  const requests = await sql<Request[]>`
    SELECT * FROM requests
  `;
  return requests;
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
