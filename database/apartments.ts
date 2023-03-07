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

// Get all apartments
export const getApartments = cache(async () => {
  const apartments = await sql<Apartment[]>`
    SELECT * FROM apartments
  `;
  return apartments;
});

// create new apartment
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

export const getApartmentsByUserId = cache(async () => {
  const apartment = await sql<Apartment[]>`
    SELECT
      users.*, apartments.*
    FROM users
    JOIN apartments
    ON users.id = apartments.user_id
  `;
  return apartment;
});
