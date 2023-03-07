'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import { LandlordResponse } from '../Landlords';

const createLandlord = gql`
  mutation CreateLandlord($name: String!, $email: String!) {
    createLandlord(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const getLandlords = gql`
  query GetLandlords {
    landlords {
      id
      name
      email
    }
  }
`;

const deleteLandlordMutation = gql`
  mutation DeleteLandlord($id: ID!) {
    deleteLandlordById(id: $id) {
      id
    }
  }
`;

const updateLandlordMutation = gql`
  mutation UpdateLandlord(
    $id: ID!
    $nameOnEditInput: String!
    $emailOnEditInput: Sring!
  ) {
    updateAnimalById(
      id: $id
      name: $nameOnEditInput
      email: $emailOnEditInput
    ) {
      id
      name
      email
    }
  }
`;

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [onError, setOnError] = useState('');

  const [onEditId, setOnEditId] = useState<number | undefined>();
  const [nameOnEditInput, setNameOnEditInput] = useState('');
  const [emailOnEditInput, setEmailOnEditInput] = useState('');

  const { loading, data, refetch } = useQuery<LandlordResponse>(getLandlords, {
    onCompleted: async () => {
      await refetch();
    },
  });

  const [handleCreateAnimal] = useMutation(createLandlord, {
    variables: {
      // this is shorthand (if both types are same)
      name,
      email,
    },

    onError: (error) => {
      setOnError(error.message);
    },
  });

  const [handleDeleteLandlord] = useMutation(deleteLandlordMutation, {
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: async () => {
      await refetch();
      setOnError('');
    },
  });

  const [handleUpdateLandlord] = useMutation(updateLandlordMutation, {
    variables: {
      id: onEditId,
      nameOnEditInput,
      emailOnEditInput,
    },

    onError: (error) => {
      setOnError(error.message);
      return;
    },

    onCompleted: async () => {
      await refetch();
      setOnError('');
    },
  });

  return (
    <div>
      <Link href="/landlords">Landlords page</Link>
      <h1>Dashboard</h1>
      <label>
        Name
        <br />
        <input
          value={name}
          onChange={(event) => {
            setName(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Email
        <br />
        <input
          value={email}
          onChange={(event) => {
            setEmail(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <br />
      <button onClick={async () => await handleCreateAnimal()}>
        Create Landlord
      </button>
      {loading && <p>Loading...</p>}
      <p>{onError}</p>
      {data?.landlords.map((landlord) => {
        const isEditing = onEditId === landlord.id;
        return (
          <div key={`${landlord.name}-${landlord.id}`}>
            {!isEditing ? (
              <span>{landlord.name}</span>
            ) : (
              <input
                value={nameOnEditInput}
                onChange={(event) => {
                  setNameOnEditInput(event.currentTarget.value);
                }}
              />
            )}
            {!isEditing ? (
              <span>{landlord.email}</span>
            ) : (
              <input
                value={emailOnEditInput}
                onChange={(event) => {
                  setEmailOnEditInput(event.currentTarget.value);
                }}
              />
            )}
            <button
              onClick={async () => {
                await handleDeleteLandlord({
                  variables: {
                    id: landlord.id,
                  },
                });
              }}
            >
              X
            </button>
            {!isEditing ? (
              <button
                onClick={() => {
                  setOnEditId(landlord.id);
                  setNameOnEditInput(landlord.name);
                  setEmailOnEditInput(landlord.email || '');
                }}
              >
                Edit
              </button>
            ) : (
              <button
                onClick={async () => {
                  setOnEditId(undefined);
                  await handleUpdateLandlord();
                }}
              >
                Save
              </button>
            )}
          </div> // Div closing the .map
        );
      })}
    </div>
  );
}
