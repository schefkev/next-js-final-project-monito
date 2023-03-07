'use client';
import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Apartment } from '../../../../../database/apartments';

const getApartmentsByUserId = gql`
  query GetApartments {
    apartments {
      id
      name
      address
      city
      unit
      zip
      rent
      occupied
      image
    }
  }
`;

export default function Apartments() {
  const { loading, error, data, refetch } = useQuery(getApartmentsByUserId, {
    onCompleted: async () => {
      await refetch;
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Apartments</h2>
      {data?.apartments.map((apartment: Apartment) => {
        return (
          <div key={`apartment-${apartment.id}`}>
            <div className="card lg:card-side bg-base-100 shadow-xl">
              <Image
                src={apartment.image}
                alt="Apartment Name"
                width="100"
                height="100"
                className="object-cover"
              />
              <div className="card-body">
                <h2 className="card-title text-primary underline decoration-primary-500/25">
                  {apartment.name}
                </h2>
                <p className="text-sm">
                  {apartment.occupied ? (
                    <p>This apartment is currently occupied</p>
                  ) : (
                    <p>This apartment is currently available</p>
                  )}
                </p>
              </div>
            </div>
            ;
          </div>
        );
      })}
    </div>
  );
}
