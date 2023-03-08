'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../public/logo1.svg';

export type ApartmentResponse = {
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

const getApartmentByUserId = gql`
  query Query($userId: Int!) {
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

export default function ApartmentPage(props: { userId: number }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('');
  const [zip, setZip] = useState('');
  const [rent, setRent] = useState('');
  const [occupied, setOccupied] = useState(false);
  const [image, setImage] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [handleCreateApartment] = useMutation(createApartment, {
    variables: {
      userId: props.userId,
      name,
      address,
      city,
      unit,
      zip,
      rent,
      occupied,
      image,
    },
    onError: (error) => {
      setOnError(error.message);
    },
  });

  return (
    <div data-theme="emerald">
      {/* Header */}
      <header className="navbar bg-primary-focus">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
      </header>
      <div>
        {data?.apartments.map((apartment: Apartment) => {
          return (
            <div key={`apartment-${apartment.id}`}>
              <div className="card lg:card-side bg-base-100 shadow-xl">
                <Link href={`/apartments/${apartment.id}`}>
                  <Image
                    src={apartment.image}
                    alt="Apartment Name"
                    width="300"
                    height="300"
                    className="object-cover"
                  />
                </Link>
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
      <div className="error">{onError}</div>
    </div>
  );
}
