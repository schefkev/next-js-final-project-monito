'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../public/logo1.svg';

export type ApartmentResponse = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

const createTenant = gql`
  mutation CreateTenant(
    $username: String!
    $password: String!
    $userId: ID
    $avatar: String!
  ) {
    createTenant(
      username: $username
      password: $password
      userId: $userId
      avatar: $avatar
    ) {
      id
      username
      avatar
    }
  }
`;

export default function CreateTenantForm(props: { userId: number }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [handleCreateTenant] = useMutation(createTenant, {
    variables: {
      username,
      password,
      userId: props.userId,
      avatar,
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
      {/* ----- Create User Name ----- */}
      <div className="flex flex-col gap-4 justify-content items-center h-screen mt-16">
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Name</span>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-md"
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create User Password ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Password</span>
            <input
              type="text"
              placeholder="Password here"
              className="input input-bordered input-md"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Create User Avatar ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Avatar</span>
            <input
              type="text"
              placeholder="Upload Avatar here"
              className="input input-bordered input-md"
              value={avatar}
              onChange={(event) => {
                setAvatar(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Add Button ----- */}
        <button
          onClick={async () => await handleCreateTenant()}
          className="btn btn-primary"
        >
          Get Started
        </button>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
