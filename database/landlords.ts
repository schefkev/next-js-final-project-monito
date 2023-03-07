import { cache } from 'react';
import { sql } from './connect';

export type Landlord = {
  id: number;
  name: string;
  email: string;
};

// Get all landlords
export const getLandlords = cache(async () => {
  const landlords = await sql<Landlord[]>`
    SELECT * FROM landlords
  `;
  return landlords;
});

// Get landlords by ID
export const getLandlordsById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }
  const [landlord] = await sql<Landlord[]>`
    SELECT
      *
    FROM
      landlords
    WHERE
      id = ${id}
  `;
  return landlord;
});

// Create landlord
export const createLandlord = cache(async (name: string, email: string) => {
  const [landlord] = await sql<Landlord[]>`
    INSERT INTO landlords
      (name, email)
    VALUES
      (${name}, ${email})
    RETURNING *
  `;
  return landlord;
});

// Detele Landlord
export const deleteLandlordById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [landlord] = await sql<Landlord[]>`
    DELETE FROM
      landlords
    WHERE
      id = ${id}
    RETURNING *
  `;
  return landlord;
});

// Update landlords
export const updateLandlordById = cache(
  async (id: number, name: string, email: string) => {
    if (Number.isNaN(id)) {
      return undefined;
    }

    const [landlord] = await sql<Landlord[]>`
    UPDATE
      landlords
    SET
      name = ${name},
      email = ${email},
    WHERE
      id = ${id}
    RETURNING *
  `;
    return landlord;
  },
);
