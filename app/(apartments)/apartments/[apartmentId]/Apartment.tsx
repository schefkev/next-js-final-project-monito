'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import PieChart from '../../../../components/DoughnutChart';
import StackedBarChart from '../../../../components/StackBarChart';
import { Request } from '../../../../database/requests';
import Logo from '../../../../public/logo1.svg';

const updateApartmentById = gql`
  mutation updateApartmentById(
    $id: ID!
    $rentOnEdit: Int
    $occupiedOnEdit: Boolean
  ) {
    updateApartmentById(id: $id, rent: $rentOnEdit, occupied: $occupiedOnEdit) {
      id
      rent
      occupied
    }
  }
`;

const getApartmentById = gql`
  query Query($apartmentsId: ID!) {
    apartments(id: $apartmentsId) {
      name
      userId
      address
      city
      unit
      zip
      rent
      occupied
      image
      tenant {
        username
        avatar
        since
        mail
        birthday
        requests {
          message
          picture
          createdAt
        }
      }
    }
  }
`;

export default function ApartmentsPage(props: {
  apartmentId: number;
  apartmentOccupation: boolean;
}) {
  const [rentOnEdit, setRentOnEdit] = useState<number>();
  const [occupiedOnEdit, setOccupiedOnEdit] = useState(
    props.apartmentOccupation,
  );
  const [isEditing, setIsEditing] = useState(false);

  const { loading, data, refetch } = useQuery(getApartmentById, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { apartmentsId: props.apartmentId },
  });

  const [handleUpdateApartment] = useMutation(updateApartmentById, {
    variables: {
      id: props.apartmentId,
      rentOnEdit,
      occupiedOnEdit,
    },

    onCompleted: async () => {
      await refetch();
    },
  });

  if (loading) return <p>Loading...</p>;

  const rent = data.apartments.rent;
  const newRent = rent.toLocaleString('en-US');

  return (
    <>
      <div className="navbar bg-secondary h-20">
        <div className="flex-1">
          <Link href="/">
            <Image src={Logo} alt="Logo" width="70" height="70" />
          </Link>
        </div>
        <div className="flex-none text-info">
          <Link href={`/profile/${data.apartments.userId}`}>
            Return to Profile
          </Link>
        </div>
      </div>
      {/* ----- DIV WITH GRID COLS 2 ----- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 mx-8 justify-center">
        <div className="">
          <Image
            src={data.apartments.image}
            alt="Apartment Name"
            width="300"
            height="300"
            className="object-cover"
          />
          <Link href={`apartments/${props.apartmentId}/Stats`}>
            Update Data
          </Link>
        </div>
        {/* ----- APARTMENTS TABLE ----- */}
        <div className="col-span-2">
          <table className=" w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                <th className="flex-1">Apartment: {data.apartments.name}</th>
                <th>
                  <button className="flex-none">
                    <PencilSquareIcon className="w-5 h-5 text-primary" />
                  </button>
                </th>
              </tr>

              <tr className="px-6 py-4">
                <td className="px-6 py-4">Address:</td>
                <td>{data.apartments.address}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">City:</td>
                <td>{data.apartments.city}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Unit:</td>
                <td>{data.apartments.unit}</td>
              </tr>
              {/* ----- UPDATE RENT ----- */}
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Rent:</td>
                <td>
                  <div className="flex items-center space-x-10">
                    {!isEditing ? (
                      <span>{newRent} ₱</span>
                    ) : (
                      <input
                        value={rentOnEdit}
                        onChange={(event) => {
                          setRentOnEdit(parseInt(event.currentTarget.value));
                        }}
                      />
                    )}
                    {!isEditing ? (
                      <button
                        className="flex-none"
                        onClick={() => {
                          setIsEditing(true);
                          setRentOnEdit(data.apartments.rent);
                          setOccupiedOnEdit(data.apartments.occupied);
                        }}
                      >
                        <PencilSquareIcon className="w-5 h-5 text-primary" />
                      </button>
                    ) : (
                      <button
                        className="flex-none"
                        onClick={async () => {
                          setIsEditing(false);
                          await handleUpdateApartment();
                        }}
                      >
                        <CheckIcon className="w-5 h-5 text-primary" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {/* ----- UPDATE OCCUPANCY ----- */}
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Occupation:</td>
                <td>
                  <div className="flex items-center space-x-10">
                    {!isEditing ? (
                      data.apartments.occupied ? (
                        <span>Occupied</span>
                      ) : (
                        <span>Available</span>
                      )
                    ) : (
                      <input
                        type="checkbox"
                        checked={occupiedOnEdit}
                        onChange={(event) => {
                          setOccupiedOnEdit(event.currentTarget.checked);
                        }}
                      />
                    )}
                    {!isEditing ? (
                      <button
                        className="flex-none"
                        onClick={() => {
                          setIsEditing(true);
                          setRentOnEdit(data.apartments.rent);
                          setOccupiedOnEdit(data.apartments.occupied);
                        }}
                      >
                        <PencilSquareIcon className="w-5 h-5 text-primary" />
                      </button>
                    ) : (
                      <button
                        className="flex-none"
                        onClick={async () => {
                          setIsEditing(false);
                          await handleUpdateApartment();
                        }}
                      >
                        <CheckIcon className="w-5 h-5 text-primary" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* ----- TENANT TABLE ----- */}
        {data.apartments.tenant ? (
          <div className="col-span-2">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                  <th className="flex-1">Tenant</th>
                  <th>
                    <button className="flex-none">
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                  </th>
                </tr>
                <tr className="px-6 py-4">
                  <td className="px-6 py-4">Name:</td>
                  <td>{data.apartments.tenant.username}</td>
                </tr>
                <tr className="px-6 py-4">
                  <td className="px-6 py-4">Tenant since:</td>
                  <td>{data.apartments.tenant.since ?? '-'}</td>
                </tr>
                <tr className="px-6 py-4">
                  <td className="px-6 py-4">Email:</td>
                  <td>{data.apartments.tenant.mail ?? '-'}</td>
                </tr>
                <tr className="px-6 py-4">
                  <td className="px-6 py-4">Birthdate:</td>
                  <td>{data.apartments.tenant.birthday ?? '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <Link href={`apartments/${props.apartmentId}/createTenant`}>
            Create Tenant
          </Link>
        )}
      </div>
      {/* ----- DATA VISUALIZATION ----- */}
      {data.apartments.tenant ? (
        <div className="grid grid-cols-1 md:grid-cols-4 mt-5 mx-8">
          <div className="col-span-1 md:col-span-2">
            <StackedBarChart />
          </div>
          <PieChart />
          <div>
            {/* ----- REQUEST TABLE ----- */}
            {data.apartments.tenant.requests.length > 0 ? (
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
                  {data.apartments.tenant.requests.map((request: Request) => {
                    const createdAt = parseInt(request.createdAt);
                    const newDate = new Date(createdAt);
                    const dateString = `${newDate.getDate()}.${
                      newDate.getMonth() + 1
                    }.${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`;
                    return (
                      <div key={`request-${request.id}`}>
                        <tr className="px-6 py-4">
                          <td className="px-6 py-4">Created: {dateString}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4">{request.message}</td>
                        </tr>
                      </div>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div>No requests for you</div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 mt-5 mx-8">
          <div className="col-span-1 md:col-span-2">
            <StackedBarChart />
          </div>
          <PieChart />
        </div>
      )}
    </>
  );
}
