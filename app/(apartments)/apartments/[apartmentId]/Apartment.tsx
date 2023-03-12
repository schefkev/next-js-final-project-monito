'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Apartment } from '../../../../database/apartments';

export type ApartmentResponse = {
  apartments: [Apartment];
} | null;

const getApartmentById = gql`
  query Query($apartmentsId: ID!) {
    apartments(id: $apartmentsId) {
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

export default function ApartmentsPage({ apartment }: { apartment: number }) {
  // console.log('apartment:', apartmentId);
  return (
    <div data-theme="emerald" className="h-screen">
      <h1>Hello {apartment} </h1>
    </div>
  );
}
