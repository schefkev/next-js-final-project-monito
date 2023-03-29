'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../public/logo1.svg';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      avatar
    }
  }
`;

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [loginHandler] = useMutation(loginMutation, {
    variables: {
      username,
      password,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      router.refresh();
    },
  });

  return (
    <div>
      {/* ----- HEADER ----- */}
      <header className="navbar bg-primary-focus">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
      </header>
      {/* ----- LOGIN FORM ----- */}
      <div className="flex flex-col gap-4 justify-content items-center h-screen mt-16">
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Name</span>
            <input
              placeholder="Please enter username"
              className="input input-bordered input-md"
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Password</span>
            <input
              type="password"
              placeholder="Please enter password"
              className="input input-bordered input-md"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <button
          onClick={async () => await loginHandler()}
          className="btn btn-primary"
        >
          Login
        </button>
        <div>
          <Link href="/tenantLogin">Login as Tenant?</Link>
        </div>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
