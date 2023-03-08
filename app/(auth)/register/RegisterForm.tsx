'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../public/logo1.svg';
import { getSafeReturnToPath } from '../../../utils/validation';

export type UserResponse = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

const createUser = gql`
  mutation createUser($username: String!, $password: String!, $avatar: String) {
    createUser(username: $username, password: $password, avatar: $avatar) {
      id
      username
      avatar
    }
  }
`;

export default function RegistrationForm(props: {
  returnTo?: string | string[];
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [handleCreateUser] = useMutation(createUser, {
    variables: {
      username,
      password,
      avatar,
    },
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: (data) => {
      const returnTo = getSafeReturnToPath(props.returnTo);
      if (returnTo) {
        router.push(returnTo);
        return;
      }
      router.replace(`/login`);
      router.refresh();
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
        <button
          onClick={async () => await handleCreateUser()}
          className="btn btn-primary"
        >
          Sign Up
        </button>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
