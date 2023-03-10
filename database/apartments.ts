import { cache } from 'react';
import { sql } from './connect';

export type Apartment = {
  id: number;
  name: string;
  address: string;
  city: string;
  unit: string;
  zip: string;
  rent: string;
  occupied: boolean;
  image: string;
};

/* ----- GET ALL THE APARTMENTS ----- */
export const getApartments = cache(async () => {
  const apartments = await sql<Apartment[]>`
    SELECT * FROM apartments
  `;
  return apartments;
});

/* ----- CREATE A NEW APARTMENT ----- */
export const createApartment = cache(
  async (
    userId: number,
    name: string,
    address: string,
    city: string,
    unit: string,
    zip: string,
    rent: string,
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
        rent: string;
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
