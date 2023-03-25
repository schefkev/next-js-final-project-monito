import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import PieChart from '../../../../components/DoughnutChart';
import StackedBarChart from '../../../../components/StackBarChart';
import { Request } from '../../../../database/requests';
import Logo from '../../../../public/logo1.svg';
import { initializeApollo } from '../../../../utils/graphql';
import ApolloClientProvider from '../../../ApolloClientProvider';

// import ApartmentsPage from './Apartment';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    apartmentId: string;
  };
};
export default async function ApartmentByIdPage(props: Props) {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data: userData } = await client.query({
    query: gql`
      query GetLoggedInUser($username: String) {
        getLoggedInUser(username: $username) {
          id
        }
      }
    `,
    variables: {
      username: sessionToken?.value,
    },
  });

  const { data } = await client.query({
    query: gql`
      query Query($apartmentsId: ID!) {
        apartments(id: $apartmentsId) {
          name
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
    `,
    variables: {
      apartmentsId: props.params.apartmentId,
    },
  });
  // console.log('data:', data);
  // console.log('userData:', userData);

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <div className="">
        <div className="navbar bg-secondary h-20">
          <div className="flex-1">
            <Link href="/">
              <Image src={Logo} alt="Logo" width="70" height="70" />
            </Link>
            <h1 className="normal-case text-xl text-info pl-6">
              {/* {data.user.username} */}
            </h1>
          </div>
          <div className="flex-none text-info">
            <Link href={`/profile/${userData.getLoggedInUser.id}`}>
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
            <Link
              href={`apartments/${props.params.apartmentId}/Stats`}
              id={data.apartments.id}
            >
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
      {/* <ApartmentsPage apartment={data} /> */}
    </ApolloClientProvider>
  );
}
