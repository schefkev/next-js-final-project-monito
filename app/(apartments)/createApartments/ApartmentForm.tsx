'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../../../public/logo1.svg';

const createApartment = gql`
  mutation CreateApartment(
    $userId: ID
    $name: String!
    $address: String!
    $city: String!
    $unit: String!
    $zip: String!
    $rent: Int!
    $occupied: Boolean!
    $image: String
  ) {
    createApartment(
      userId: $userId
      name: $name
      address: $address
      city: $city
      unit: $unit
      zip: $zip
      rent: $rent
      occupied: $occupied
      image: $image
    ) {
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

export default function ApartmentForm(props: { userId: number }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('');
  const [zip, setZip] = useState('');
  const [rent, setRent] = useState('');
  const [occupied, setOccupied] = useState(false);
  const [image, setImage] = useState('');
  const [onError, setOnError] = useState('');

  const [handleCreateApartment] = useMutation(createApartment, {
    variables: {
      userId: props.userId,
      name,
      address,
      city,
      unit,
      zip,
      rent: parseInt(rent),
      occupied,
      image,
    },
    onError: (error) => {
      setOnError(error.message);
    },
  });

  return (
    <div>
      {/* Header */}
      <header className="navbar bg-secondary h-20">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
        <div className="flex-none text-info">
          <Link href={`/profile/${props.userId}`}>Return to Profile</Link>
        </div>
      </header>
      {/* ----- Create Apartment Name ----- */}
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Name</span>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-md"
              value={name}
              onChange={(event) => {
                setName(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Address ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Address</span>
            <input
              type="text"
              placeholder="Password here"
              className="input input-bordered input-md"
              value={address}
              onChange={(event) => {
                setAddress(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment City ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">City</span>
            <input
              type="text"
              placeholder="Password here"
              className="input input-bordered input-md"
              value={city}
              onChange={(event) => {
                setCity(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Unit ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Unit</span>
            <input
              type="text"
              placeholder="Password here"
              className="input input-bordered input-md"
              value={unit}
              onChange={(event) => {
                setUnit(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Zip Code ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Zip Code</span>
            <input
              type="text"
              placeholder="Password here"
              className="input input-bordered input-md"
              value={zip}
              onChange={(event) => {
                setZip(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Rental  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Rental Price</span>
            <input
              // type="number"
              placeholder="Password here"
              className="input input-bordered input-md"
              value={rent}
              onChange={(event) => {
                setRent(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Occupation  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Occupation</span>
            <input
              type="checkbox"
              placeholder="Password here"
              className="input input-bordered input-md"
              checked={occupied}
              onChange={(event) => {
                setOccupied(event.currentTarget.checked);
              }}
            />
          </label>
        </div>
        {/* ----- Create Apartment Pictures ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Pictures</span>
            <input
              type="text"
              placeholder="Upload Avatar here"
              className="input input-bordered input-md"
              value={image}
              onChange={(event) => {
                setImage(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Add Button ----- */}
        <button
          onClick={async () => await handleCreateApartment()}
          className="btn btn-primary"
        >
          Get Started
        </button>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
