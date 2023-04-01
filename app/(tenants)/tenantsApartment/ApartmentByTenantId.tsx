'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import StackedBarChartTenant from '../../../components/StackBarChartTenant';
import { Request } from '../../../database/requests';

const updateTenantById = gql`
  mutation updateTenantById(
    $id: ID!
    $mailOnEdit: String
    $birthdayOnEdit: String
  ) {
    updateTenantById(id: $id, mail: $mailOnEdit, birthday: $birthdayOnEdit) {
      id
      mail
      birthday
    }
  }
`;
const getTenantWithApartment = gql`
  query Query($tenantId: ID!) {
    tenant(id: $tenantId) {
      username
      since
      mail
      id
      birthday
      avatar
      apartment {
        address
        city
        id
        image
        name
        rent
        unit
        zip
      }
      requests {
        message
        createdAt
        status
        comment
      }
    }
  }
`;

export default function TenantApartmentsPage(props: { userId: number }) {
  const [mailOnEdit, setMailOnEdit] = useState('');
  const [birthdayOnEdit, setBirthdayOnEdit] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { loading, data, refetch } = useQuery(getTenantWithApartment, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { tenantId: props.userId },
  });

  const [handleUpdateTenant] = useMutation(updateTenantById, {
    variables: {
      id: props.userId,
      mailOnEdit,
      birthdayOnEdit,
    },
    onCompleted: async () => {
      await refetch();
    },
  });

  if (loading) return <p>Loading...</p>;
  console.log('user:', data);
  const rent = data.tenant.apartment.rent;
  const newRent = rent.toLocaleString('en-US');

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 mx-8 justify-center">
        <div className="">
          <Image
            src={data.tenant.apartment.image}
            alt="Apartment Name"
            width="300"
            height="300"
            className="object-cover"
          />
          <button
            className="btn btn-xs btn-primary mt-5"
            onClick={() => {
              router.refresh();
              router.replace(`/requests`);
            }}
          >
            Create New Request
          </button>
        </div>
        {/* ----- APARTMENT TABLE ----- */}
        <div className="col-span-2">
          <table className=" w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                <th className="flex-1">
                  Apartment: {data.tenant.apartment.name}
                </th>
              </tr>

              <tr className="px-6 py-4">
                <td className="px-6 py-4">Address:</td>
                <td>{data.tenant.apartment.name}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">City:</td>
                <td>{data.tenant.apartment.city}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Unit:</td>
                <td>{data.tenant.apartment.unit}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Rent:</td>
                <td>{newRent} ₱</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* ----- TENANT TABLE ----- */}
        <div className="col-span-2">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                <th className="flex-1">Tenant</th>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Name:</td>
                <td>{data.tenant.username}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Tenant since:</td>
                <td>{data.tenant.since ?? '-'}</td>
              </tr>
              {/* ----- UPDATE TENANT MAIL ----- */}
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Email:</td>
                <td className="flex items-center space-x-10">
                  {!isEditing ? (
                    <span className="flex-grow py-4">
                      {data.tenant.mail ?? '-'}
                    </span>
                  ) : (
                    <input
                      type="email"
                      value={mailOnEdit}
                      onChange={(event) => {
                        setMailOnEdit(event.currentTarget.value);
                      }}
                    />
                  )}
                  {!isEditing ? (
                    <button
                      className="flex-none py-4"
                      onClick={() => {
                        setIsEditing(true);
                        setMailOnEdit(data.tenant.mail);
                      }}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                  ) : (
                    <button
                      className="flex-none py-4"
                      onClick={async () => {
                        setIsEditing(false);
                        await handleUpdateTenant();
                      }}
                    >
                      <CheckIcon className="w-5 h-5 text-primary" />
                    </button>
                  )}
                </td>
              </tr>
              {/* ----- UPDATE TENANT BIRTHDAY ----- */}
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Birthdate:</td>
                <td className="flex items-center space-x-10">
                  {!isEditing ? (
                    <span className="flex-grow py-4">
                      {data.tenant.birthday ?? '-'}
                    </span>
                  ) : (
                    <input
                      className="flex-none"
                      value={birthdayOnEdit}
                      onChange={(event) => {
                        setBirthdayOnEdit(event.currentTarget.value);
                      }}
                    />
                  )}
                  {!isEditing ? (
                    <button
                      className="flex-none items-center py-4"
                      onClick={() => {
                        setIsEditing(true);
                        setBirthdayOnEdit(data.tenant.birthday);
                      }}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                  ) : (
                    <button
                      className="flex-none items-center py-4"
                      onClick={async () => {
                        setIsEditing(false);
                        await handleUpdateTenant();
                      }}
                    >
                      <CheckIcon className="w-5 h-5 text-primary" />
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* ----- REQUEST TABLE ----- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 mx-8 justify-center">
        <div className="col-span-1 md:col-span-3">
          <StackedBarChartTenant />
        </div>
        <div className="col-span-2 ">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                <th className="flex-1">Requests</th>
                <th>
                  <button className="flex-none">
                    <PencilSquareIcon className="w-5 h-5 text-primary" />
                  </button>
                </th>
              </tr>
              {data.tenant.requests.map((request: Request) => {
                const createdAt = parseInt(request.createdAt);
                const newDate = new Date(createdAt);
                const dateString = `${newDate.getDate()}.${
                  newDate.getMonth() + 1
                }.${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`;
                return (
                  <div key={`request-${request.id}`}>
                    <tr className="px-6 py-2 flex flex-row">
                      <td className="basis-1/2">Created: {dateString}</td>
                      <td className="basis-1/2 flex justify-center items-center space-x-10 pl-16">
                        {request.status ? (
                          <span className="badge badge-success badge-sm">
                            Closed
                          </span>
                        ) : (
                          <span className=" badge badge-error badge-sm">
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2">You: {request.message}</td>
                    </tr>
                    <tr>
                      {request.comment ? (
                        <td className="px-6 py-2">
                          Landlord: {request.comment}
                        </td>
                      ) : (
                        <span />
                      )}
                    </tr>
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
