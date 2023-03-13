import { cache } from 'react';
import { sql } from './connect';

export type Apartment = {
  id: number;
  name: string;
  address: string;
  city: string;
  unit: string;
  zip: string;
  rent: number;
  occupied: boolean;
  image: string;
};

/* ----- GET THE APARTMENT BY ITS ID ----- */
export const getApartmentById = cache(async (id: number) => {
  const [apartment] = await sql<Apartment[]>`
    SELECT
      *
    FROM
      apartments
    WHERE
      id = ${id}
  `;
  return apartment;
});

/* ----- GET ALL THE APARTMENTS ----- */
export const getApartments = cache(async () => {
  const apartments = await sql<Apartment[]>`
    SELECT * FROM apartments
  `;
  return apartments;
});

/* ----- GET APARTMENTS WITH TENANTS (JOIN) ----- */
/* export const getApartmentByUserId = cache(async (userId: number) => {
  const results = await sql<Apartment[]>`
    SELECT
      apartments.*,
      tenants.username AS tenant_username
    FROM
      apartments
    INNER JOIN
      tenants
    ON
      apartments.tenant_id = tenants.id
    WHERE
      apartments.user_id = ${userId}
  `;
  return results;
}); */

/* ----- CREATE A NEW APARTMENT ----- */
export const createApartment = cache(
  async (
    userId: number,
    name: string,
    address: string,
    city: string,
    unit: string,
    zip: string,
    rent: number,
    occupied: boolean,
    image: string,
  ) => {
    const [apartment] = await sql<
      {
        id: number;
        user_id: number;
        name: string;
        address: string;
        city: string;
        unit: string;
        zip: string;
        rent: number;
        occupied: boolean;
        image: string;
      }[]
    >`
    INSERT INTO apartments
      (user_id, name, address, city, unit, zip, rent, occupied, image)
    VALUES
      (${userId}, ${name}, ${address}, ${city}, ${unit}, ${zip}, ${rent}, ${occupied}, ${image})
    RETURNING
      id,
      name,
      address,
      city,
      unit,
      zip,
      rent,
      occupied,
      image
    `;
    return apartment;
  },
);

/* ----- GET THE APARTMENT WITH THE USER-ID ----- */
export const getApartmentByUserId = cache(async (userId: number) => {
  const userApartment = await sql<Apartment[]>`
    SELECT
      *
    FROM
      apartments
    WHERE
      user_id = ${userId}
  `;
  return userApartment;
});
