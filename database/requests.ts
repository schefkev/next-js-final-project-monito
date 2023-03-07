import { cache } from 'react';
import { sql } from './connect';

export type Request = {
  id: number;
  title: string;
  message: string;
  tenants_id: number;
  landlords_id: number;
};

// Get all users
export const getRequests = cache(async () => {
  const requests = await sql<Request[]>`
    SELECT * FROM requests
  `;
  return requests;
});
