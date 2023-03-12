'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Apartment } from '../../../database/apartments';

export type ApartmentResponse = {
  apartments: [Apartment];
} | null;

const getApartmentByUserId = gql`
  query Query($userId: String) {
    apartmentByUserId(userId: $userId) {
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
// console.log('query:', getApartmentByUserId);

export default function ApartmentsPage(props: { userId: number }) {
  const { loading, data, refetch } = useQuery(getApartmentByUserId, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { userId: props.userId },
  });

  if (loading) return <p>Loading...</p>;
  // console.log('apartment-site:', data);
  // console.log('user:', props.userId);

  return (
    <div className="">
      {data?.apartmentByUserId.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center mt-24">
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-neutral">
              You have no appartments in your Dashboard, want to add your first
              one?
            </h3>
            <div className="text-center hover:text-primary-focus">
              <Link href="/createApartments">Create Apartment</Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {data?.apartmentByUserId.map((apartment: Apartment) => {
            return (
              <div key={`apartment-${apartment.id}`}>
                <div className="card lg:card-side bg-base-100 shadow-xl m-8">
                  <Image
                    src={apartment.image}
                    alt="Apartment Name"
                    width="300"
                    height="300"
                    className="object-cover"
                  />
                  <div className="card-body">
                    <Link href={`apartments/${apartment.id}`}>
                      <h2 className="card-title text-primary underline decoration-primary-500/25">
                        {apartment.name}
                      </h2>
                    </Link>
                    <p className="text-sm">
                      {apartment.occupied ? (
                        <p>This apartment is currently occupied</p>
                      ) : (
                        <p>This apartment is currently available</p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
