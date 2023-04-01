import { cache } from 'react';
import { sql } from './connect';

export type Stats = {
  data: any;
  id: number;
  userId: number;
  apartmentId: number;
  rent: number;
  mortgage: number;
  expense: number;
  month: string;
  year: string;
};

/* ----- GET ALL THE STATS ----- */
export const getStats = cache(async () => {
  const stats = await sql<Stats[]>`
    SELECT * FROM stats
  `;
  return stats;
});

/* ----- GET THE STATS WITH THE APARTMENT ID ----- */
export const getStatsById = cache(async (apartmentId: number) => {
  const stats = await sql<Stats[]>`
  SELECT
    *
  FROM
    stats
  WHERE
    apartment_id = ${apartmentId}
  `;
  return stats;
});

/* ----- CREATE A NEW STAT ----- */
export const createStats = cache(
  async (
    userId: number,
    apartmentId: number,
    rent: number,
    mortgage: number,
    expense: number,
    month: string,
    year: string,
  ) => {
    const [stats] = await sql<
      {
        id: number;
        user_id: number;
        apartment_id: number;
        rent: number;
        mortgage: number;
        expense: number;
        month: string;
        year: string;
      }[]
    >`
  INSERT INTO stats
    (user_id, apartment_id, rent, mortgage, expense, month, year)
  VALUES
    (${userId}, ${apartmentId}, ${rent}, ${mortgage}, ${expense}, ${month}, ${year})
  RETURNING
    id,
    rent,
    mortgage,
    expense,
    month,
    year
  `;
    return stats;
  },
);
