import { cache } from 'react';
import { sql } from './connect';

export type Apartment = {
  id: number;
  tenantId: number;
  name: string;
  address: string;
  city: string;
  unit: string;
  zip: string;
  rent: number;
  occupied: boolean;
  image: string;
  tenant: {
    id: number;
    username: string;
    avatar: string;
    requests: {
      length: number;
      id: number;
      message: string;
      picture: string;
    };
  };
  requests: {
    id: number;
    message: string;
    picture: string;
  };
};

/* ----- GET THE APARTMENT BY ITS ID ----- !!*/
export const getApartmentById = cache(async (id: number) => {
  const [apartment] = await sql<
    {
      id: number;
      tenantId: number;
      name: string;
      address: string;
      city: string;
      unit: string;
      zip: string;
      rent: number;
      occupied: boolean;
      image: string;
      tenant: {
        id: number;
        username: string;
        avatar: string;
        requests: {
          length: number;
          id: number;
          message: string;
          picture: string;
        };
      };
      requests: { id: number; message: string; picture: string };
    }[]
  >`
    SELECT
      *
    FROM
      apartments
    WHERE
      id = ${id}
  `;
  return apartment;
});

/* ----- GET ALL THE APARTMENTS ----- !!*/
export const getApartments = cache(async () => {
  const apartments = await sql<
    {
      id: number;
      tenantId: number;
      name: string;
      address: string;
      city: string;
      unit: string;
      zip: string;
      rent: number;
      occupied: boolean;
      image: string;
      tenant: {
        id: number;
        username: string;
        avatar: string;
        requests: {
          length: number;
          id: number;
          message: string;
          picture: string;
        };
      };
      requests: { id: number; message: string; picture: string };
    }[]
  >`
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
    rent: number,
    occupied: boolean,
    image: string,
  ) => {
    const [apartment] = await sql<
      {
        id: number;
        tenantId: number;
        name: string;
        address: string;
        city: string;
        unit: string;
        zip: string;
        rent: number;
        occupied: boolean;
        image: string;
        tenant: {
          id: number;
          username: string;
          avatar: string;
          requests: {
            length: number;
            id: number;
            message: string;
            picture: string;
          };
        };
        requests: { id: number; message: string; picture: string };
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
  const userApartment = await sql<
    {
      id: number;
      tenantId: number;
      name: string;
      address: string;
      city: string;
      unit: string;
      zip: string;
      rent: number;
      occupied: boolean;
      image: string;
      tenant: {
        id: number;
        username: string;
        avatar: string;
        requests: {
          length: number;
          id: number;
          message: string;
          picture: string;
        };
      };
      requests: { id: number; message: string; picture: string };
    }[]
  >`
    SELECT
      *
    FROM
      apartments
    WHERE
      user_id = ${userId}
  `;
  return userApartment;
});

/* ----- GET THE APARTMENT WITH THE TENANT-ID ----- */
export const getApartmentByTenantId = cache(async (tenantId: number) => {
  const tenantApartment = await sql<
    {
      id: number;
      tenantId: number;
      name: string;
      address: string;
      city: string;
      unit: string;
      zip: string;
      rent: number;
      occupied: boolean;
      image: string;
      tenant: {
        id: number;
        username: string;
        avatar: string;
        requests: {
          length: number;
          id: number;
          message: string;
          picture: string;
        };
      };
      requests: { id: number; message: string; picture: string };
    }[]
  >`
  SELECT
  *
  FROM
  apartments
  WHERE
  tenant_id = ${tenantId}
  `;
  return tenantApartment;
});

/* ----- UPDATE APARTMENT WITH TENANT ID ----- */
export const updateApartmentWithTenantId = cache(
  async (id: number, tenantId: number) => {
    if (Number.isNaN(id)) {
      return undefined;
    }

    const [apartment] = await sql<
      {
        id: number;
        tenantId: number;
        name: string;
        address: string;
        city: string;
        unit: string;
        zip: string;
        rent: number;
        occupied: boolean;
        image: string;
        tenant: {
          id: number;
          username: string;
          avatar: string;
          requests: {
            length: number;
            id: number;
            message: string;
            picture: string;
          };
        };
        requests: { id: number; message: string; picture: string };
      }[]
    >`
    UPDATE
      apartments
    SET
      tenant_id = ${tenantId}
    WHERE
      id = ${id}
    RETURNING *
  `;
    return apartment;
  },
);

/* ----- UPDATE THE APARTMENT WITH ITS ID ----- */
export const updateApartmentById = cache(
  async (id: number, rent: number, occupied: boolean) => {
    if (Number.isNaN(id)) {
      return undefined;
    }

    const [apartment] = await sql<
      {
        id: number;
        tenantId: number;
        name: string;
        address: string;
        city: string;
        unit: string;
        zip: string;
        rent: number;
        occupied: boolean;
        image: string;
        tenant: {
          id: number;
          username: string;
          avatar: string;
          requests: {
            length: number;
            id: number;
            message: string;
            picture: string;
          };
        };
        requests: { id: number; message: string; picture: string };
      }[]
    >`
  UPDATE
    apartments
  SET
    rent = ${rent},
    occupied = ${occupied}
  WHERE
    id = ${id}
  RETURNING *
  `;
    return apartment;
  },
);

/* ----- DELETE THE APARTMENT WITH ITS ID ----- */
export const deleteApartmentById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [apartment] = await sql<
    {
      id: number;
      tenantId: number;
      name: string;
      address: string;
      city: string;
      unit: string;
      zip: string;
      rent: number;
      occupied: boolean;
      image: string;
      tenant: {
        id: number;
        username: string;
        avatar: string;
        requests: {
          length: number;
          id: number;
          message: string;
          picture: string;
        };
      };
      requests: { id: number; message: string; picture: string };
    }[]
  >`
  DELETE FROM
    apartments
  WHERE
    id = ${id}
  RETURNING *
  `;
  return apartment;
});
