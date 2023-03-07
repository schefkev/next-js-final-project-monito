'use client';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Landlord } from '../../database/landlords';

export type LandlordResponse = {
  landlords: Landlord[];
};

const getLandlord = gql`
  query GetLandlords {
    landlords {
      id
      name
      email
    }
  }
`;

export default function Landlords() {
  const { loading, error, data, refetch } = useQuery(getLandlord, {
    onCompleted: async () => {
      await refetch;
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Landlords</h1>

      {data?.landlords.map((landlord: Landlord) => {
        return (
          <div key={`landlord-${landlord.id}`}>
            <h2>
              <Link href={`/landlords/${landlord.id}`}>{landlord.name}</Link>
            </h2>

            <Link href={`/landlords/${landlord.id}`}>
              {/*  <Image
                src={`/images/${
                  animal.id
                }-${animal.firstName.toLowerCase()}.jpeg`}
                alt=""
                width="200"
                height="200"
              /> */}
            </Link>

            <p>Email: {landlord.email}</p>
            <p>ID: {landlord.id}</p>
          </div>
        );
      })}
    </>
  );
}
