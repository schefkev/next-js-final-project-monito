'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PieChart from '../../../../components/DoughnutChart';
import StackedBarChart from '../../../../components/StackBarChart';
import { Request } from '../../../../database/requests';
import Logo from '../../../../public/logo1.svg';

const updateApartmentRentById = gql`
  mutation updateApartmentRentById($id: ID!, $rentOnEdit: Int) {
    updateApartmentRentById(id: $id, rent: $rentOnEdit) {
      id
      rent
    }
  }
`;

const updateApartmentOccupancyById = gql`
  mutation updateApartmentOccupancyById($id: ID!, $occupiedOnEdit: Boolean) {
    updateApartmentOccupancyById(id: $id, occupied: $occupiedOnEdit) {
      id
      occupied
    }
  }
`;

const updateRequestCommentById = gql`
  mutation updateRequestCommentById($id: ID!, $commentOnEdit: String) {
    updateRequestCommentById(id: $id, comment: $commentOnEdit) {
      id
      comment
    }
  }
`;

const updateRequestStatusById = gql`
  mutation updateRequestStatusById($id: ID!, $statusOnEdit: Boolean) {
    updateRequestStatusById(id: $id, status: $statusOnEdit) {
      id
      status
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
          id
          message
          picture
          createdAt
          comment
          status
        }
      }
    }
  }
`;

export default function ApartmentsPage(props: {
  apartmentId: number;
  apartmentOccupation: boolean;
}) {
  const { loading, data, refetch } = useQuery(getApartmentById, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { apartmentsId: props.apartmentId },
  });
  // console.log('apartment:', data);

  const [rentOnEdit, setRentOnEdit] = useState<number>();
  const [occupiedOnEdit, setOccupiedOnEdit] = useState(
    props.apartmentOccupation,
  );
  const [isEditingOccupancy, setIsEditingOccupancy] = useState(false);
  const [isEditingRent, setIsEditingRent] = useState(false);
  const [commentOnEdit, setCommentOnEdit] = useState('');
  const [statusOnEdit, setStatusOnEdit] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const router = useRouter();

  const requestId =
    data?.apartments.tenant.requests.length > 0
      ? data.apartments.tenant.requests[0].id
      : null;
  // console.log('requestId:', requestId);

  const [handleUpdateApartmentRent] = useMutation(updateApartmentRentById, {
    variables: {
      id: props.apartmentId,
      rentOnEdit,
    },

    onCompleted: async () => {
      await refetch();
    },
  });
  const [handleUpdateApartmentOccupancy] = useMutation(
    updateApartmentOccupancyById,
    {
      variables: {
        id: props.apartmentId,
        occupiedOnEdit,
      },

      onCompleted: async () => {
        await refetch();
      },
    },
  );

  const [handleUpdateRequestComment] = useMutation(updateRequestCommentById, {
    variables: {
      id: requestId,
      commentOnEdit,
    },

    onCompleted: async () => {
      await refetch();
    },
  });

  const [handleUpdateRequestStatus] = useMutation(updateRequestStatusById, {
    variables: {
      id: requestId,
      statusOnEdit,
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
          <button
            className="btn btn-xs mt-5 btn-primary"
            onClick={() => {
              router.replace(`apartments/${props.apartmentId}/Stats`);
              router.refresh();
            }}
          >
            Update Report Data
          </button>
        </div>
        {/* ----- APARTMENTS TABLE ----- */}
        <div className="col-span-2">
          <table className=" w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                <th className="flex-1">Apartment: {data.apartments.name}</th>
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
                <td className="flex items-center space-x-10">
                  {!isEditingRent ? (
                    <span className="flex-grow py-4">{newRent} ₱</span>
                  ) : (
                    <input
                      value={rentOnEdit}
                      onChange={(event) => {
                        setRentOnEdit(parseInt(event.currentTarget.value));
                      }}
                    />
                  )}
                  {!isEditingRent ? (
                    <button
                      className="flex-none"
                      onClick={() => {
                        setIsEditingRent(true);
                        setRentOnEdit(data.apartments.rent);
                      }}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                  ) : (
                    <button
                      className="flex-none"
                      onClick={async () => {
                        setIsEditingRent(false);
                        await handleUpdateApartmentRent();
                      }}
                    >
                      <CheckIcon className="w-5 h-5 text-primary" />
                    </button>
                  )}
                </td>
              </tr>
              {/* ----- UPDATE OCCUPANCY ----- */}
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Occupation:</td>
                <td className="flex items-center space-x-10">
                  {!isEditingOccupancy ? (
                    data.apartments.occupied ? (
                      <span className="flex-grow py-4">Occupied</span>
                    ) : (
                      <span className="flex-grow py-4">Available</span>
                    )
                  ) : (
                    <input
                      type="checkbox"
                      className="px-6"
                      checked={occupiedOnEdit}
                      onChange={(event) => {
                        setOccupiedOnEdit(event.currentTarget.checked);
                      }}
                    />
                  )}
                  {!isEditingOccupancy ? (
                    <button
                      className="flex-none"
                      onClick={() => {
                        setIsEditingOccupancy(true);
                        setOccupiedOnEdit(data.apartments.occupied);
                      }}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                  ) : (
                    <button
                      className="flex-none"
                      onClick={async () => {
                        setIsEditingOccupancy(false);
                        await handleUpdateApartmentOccupancy();
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
        {/* ----- TENANT TABLE ----- */}
        {data.apartments.tenant ? (
          <div className="col-span-2">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                  <th className="flex-1">Tenant</th>
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
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              router.replace(`/apartments/${props.apartmentId}/createTenant`);
              router.refresh();
            }}
          >
            Create New Tenant
          </button>
        )}
      </div>
      {/* ----- DATA VISUALIZATION + REQUESTS ----- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 mx-8 justify-center">
        <div className="col-span-1 md:col-span-2">
          <StackedBarChart />
        </div>
        <div className="col-span-1">
          <PieChart />
        </div>
        <div className="col-span-2">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                <th className="flex-1">Requests</th>
              </tr>
              {data.apartments.tenant.requests.map((request: Request) => {
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
                        {/* ----- UPDATE STATUS ----- */}
                        {!isEditingStatus ? (
                          request.status ? (
                            <span className="badge badge-success badge-sm">
                              Closed
                            </span>
                          ) : (
                            <span className=" badge badge-error badge-sm">
                              In Progress
                            </span>
                          )
                        ) : (
                          <input
                            type="checkbox"
                            className="px-6"
                            checked={statusOnEdit}
                            onChange={(event) => {
                              setStatusOnEdit(event.currentTarget.checked);
                            }}
                          />
                        )}
                        {!isEditingStatus ? (
                          <button
                            className="flex-none"
                            onClick={() => {
                              setIsEditingStatus(true);
                              setStatusOnEdit(
                                data.apartments.tenant.requests.status,
                              );
                            }}
                          >
                            <PencilSquareIcon className="w-5 h-5 text-primary" />
                          </button>
                        ) : (
                          <button
                            className="flex-none"
                            onClick={async () => {
                              setIsEditingStatus(false);
                              await handleUpdateRequestStatus();
                            }}
                          >
                            <CheckIcon className="w-5 h-5 text-primary" />
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-1">You: {request.message}</td>
                    </tr>
                    {/* ----- UPDATE COMMENT ----- */}

                    <tr className="px-6 py-1 flex flex-row justify-between ">
                      <td className="flex justify-center items-center space-x-10">
                        {!isEditingComment ? (
                          <span className="">{request.comment}</span>
                        ) : (
                          <input
                            value={commentOnEdit}
                            onChange={(event) => {
                              setCommentOnEdit(event.currentTarget.value);
                            }}
                          />
                        )}
                        {!isEditingComment ? (
                          <button
                            className="flex-none btn btn-xs btn-success"
                            onClick={() => {
                              setIsEditingComment(true);
                              setCommentOnEdit(
                                data.apartments.tenant.requests.comment,
                              );
                            }}
                          >
                            Comment
                          </button>
                        ) : (
                          <button
                            className="flex-none"
                            onClick={async () => {
                              setIsEditingComment(false);
                              await handleUpdateRequestComment();
                            }}
                          >
                            <CheckIcon className="w-5 h-5 text-primary" />
                          </button>
                        )}
                      </td>
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
