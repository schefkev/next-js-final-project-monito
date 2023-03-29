'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../../../../../public/logo1.svg';

const createTenant = gql`
  mutation CreateTenant(
    $username: String!
    $password: String!
    $userId: ID
    $apartmentId: ID
    $avatar: String!
    $since: String
  ) {
    createTenant(
      username: $username
      password: $password
      userId: $userId
      apartmentId: $apartmentId
      avatar: $avatar
      since: $since
    ) {
      id
      username
      avatar
      since
    }
  }
`;

export default function TenantForm(props: {
  userId: number;
  apartmentId: number;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [since, setSince] = useState('');
  const [onError, setOnError] = useState('');

  const [handleCreateTenant] = useMutation(createTenant, {
    variables: {
      username,
      password,
      userId: props.userId,
      apartmentId: props.apartmentId,
      avatar,
      since,
    },
    onError: (error) => {
      setOnError(error.message);
    },
  });

  return (
    <div>
      {/* ----- HEADER ----- */}
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
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        {/* ----- CREATE USERNAME  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Name</span>
            <input
              placeholder="Name here"
              className="input input-bordered input-md"
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- CREATE USER PASSWORD  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Password</span>
            <input
              placeholder="Password here"
              className="input input-bordered input-md"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- CREATE USER AVATAR  ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Avatar</span>
            <input
              placeholder="Avatar here"
              className="input input-bordered input-md"
              value={avatar}
              onChange={(event) => {
                setAvatar(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- CREATE USER SINCE ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Since</span>
            <input
              placeholder="Tenant since"
              className="input input-bordered input-md"
              value={since}
              onChange={(event) => {
                setSince(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- CREATE BUTTON ----- */}
        <button
          onClick={async () => await handleCreateTenant()}
          className="btn btn-primary"
        >
          Create Tenant
        </button>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
