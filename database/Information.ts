import { cache } from 'react';
import { sql } from './connect';

export type Information = {
  id: number;
  landlords_id: number;
  apartments_id: number;
};

// Get all users
/* export const getLandlordApartmentById = cache(async (id: number) => {
  const information = await sql<Information[]>`
    SELECT
      landlords.id AS landlords_id,
      landlords.name,
      apartments.id AS apartments_id,
      apartments.address AS apartments_address,
      tenants.id AS tenants_id,
      tenants.name,
      requests.id AS requests_id,
      requests.message AS requests_message
    FROM
      landlords
    INNER JOIN Information
    ON landlords.id = Information.landlords_id
    INNER JOIN apartments
    ON apartments.id = Information.apartments_id
    INNER JOIN tenants
    ON tenants.id = Information.tenants_id
    INNER JOIN requests
    ON requests.id = Information.requests_id
    WHERE
      landlords.id = ${id}
  `;
  return information;
}); */

export type LandlordInfo = {
  id: number;
};

// Get all users
export const getLandlordInfo = cache(async (id: number) => {
  const landlords = await sql<LandlordInfo[]>`
    SELECT
  coalesce(landlords.id, 0) AS landlords_id,
  landlords.name,
  apartments.id AS apartments_id,
  apartments.address AS apartments_address,
  tenants.id AS tenants_id,
  tenants.name,
  requests.id AS requests_id,
  requests.message AS requests_message
FROM
  landlords
INNER JOIN Information
ON landlords.id = Information.landlords_id
INNER JOIN apartments
ON apartments.id = Information.apartments_id
INNER JOIN tenants
ON tenants.id = Information.tenants_id
INNER JOIN requests
ON requests.id = Information.requests_id
WHERE
  landlords.id = ${id}

  `;
  return landlords;
});
