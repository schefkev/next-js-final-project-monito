'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import PieChart from '../../../../components/DoughnutChart';
import StackedBarChart from '../../../../components/StackBarChart';
import { Request } from '../../../../database/requests';
import Logo from '../../../../public/logo1.svg';

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
        requests {
          message
          picture
          createdAt
        }
      }
    }
  }
`;

export default function ApartmentsPage(props: { apartmentId: number }) {
  const { loading, data, refetch } = useQuery(getApartmentById, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { apartmentsId: props.apartmentId },
  });

  if (loading) return <p>Loading...</p>;
  console.log('apartment:', data);

  return (
    <div className="">
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
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="">
                <th className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                  <td>Apartment: {data.apartments.name}</td>
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
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Rent:</td>
                <td>{data.apartments.rent} ₱</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* ----- TENANT TABLE ----- */}
        <div className="col-span-2">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              <tr className="">
                <th className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                  <td>Tenant</td>
                </th>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Name:</td>
                <td>{data.apartments.tenant.username}</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Tenant since:</td>
                <td>01.01.2023</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Email:</td>
                <td>chari.brio@google.ph</td>
              </tr>
              <tr className="px-6 py-4">
                <td className="px-6 py-4">Birthdate:</td>
                <td>25.12.1995</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* ----- DATA VISUALIZATION ----- */}
      {data.apartments.tenant.requests.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 mx-8">
          <StackedBarChart />
          <PieChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 mt-5 mx-8">
          <div className="col-span-1 md:col-span-2">
            <StackedBarChart />
          </div>
          <PieChart />
          {/* ----- REQUEST TABLE ----- */}
          <div className="">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                <tr className="">
                  <th className="flex gap-3 px-6 py-4 font-normal text-primary text-xl">
                    <td>Requests</td>
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
          </div>
        </div>
      )}
    </div>
  );
}
