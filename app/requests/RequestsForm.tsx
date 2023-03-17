'use client';

import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../public/logo1.svg';

export type ApartmentResponse = {
  id: number;
  username: string;
  password: string;
  avatar: string;
};

const createRequest = gql`
  mutation CreateRequest($tenantId: ID!, $message: String!, $picture: String!) {
    createRequest(tenantId: $tenantId, message: $message, picture: $picture) {
      id
      message
      picture
    }
  }
`;

export default function RequestsForm(props: { userId: number }) {
  const [message, setMessage] = useState('');
  const [picture, setPicture] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [handleCreateRequest] = useMutation(createRequest, {
    variables: {
      tenantId: props.userId,
      message,
      picture,
    },
    onError: (error) => {
      setOnError(error.message);
    },
  });

  return (
    <div>
      <header className="navbar bg-primary-focus">
        <div className="flex-1 ml-6">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
      </header>
      {/* ----- CREATE THE REQUEST MESSAGE ----- */}
      <div className="flex flex-col gap-4 justify-content items-center h-screen mt-16">
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Message</span>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Request"
              value={message}
              onChange={(event) => {
                setMessage(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- CREATE THE REQUEST PICTURE ----- */}
        <div className="form-control">
          <label className="input-group input-group-md">
            <span className="w-28">Picture</span>
            <input
              type="text"
              placeholder="Upload Avatar here"
              className="input input-bordered input-md"
              value={picture}
              onChange={(event) => {
                setPicture(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        {/* ----- Add Button ----- */}
        <button
          onClick={async () => await handleCreateRequest()}
          className="btn btn-primary"
        >
          Get Started
        </button>
        <div className="error">{onError}</div>
      </div>
    </div>
  );
}
