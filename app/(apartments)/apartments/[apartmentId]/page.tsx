import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
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
        }
      }
    `,
    variables: {
      apartmentsId: props.params.apartmentId,
    },
  });
  console.log('data:', data);

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <div className="h-screen">
        <div className="navbar bg-secondary h-20">
          <div className="flex-1">
            <Link href="/">
              <Image src={Logo} alt="Logo" width="70" height="70" />
            </Link>
            <h1 className="normal-case text-xl text-info pl-6">
              {/* {data.user.username} */}
            </h1>
          </div>
        </div>
        <div className="card lg:card-side bg-base-100 shadow-xl m-8 ">
          <Image
            src={data.apartments.image}
            alt="Apartment Name"
            width="300"
            height="300"
            className="object-cover"
          />
          <div className="card-body">
            <h2 className="card-title text-primary underline decoration-primary-500/25">
              {data.apartments.name}
            </h2>
            <div className="grid grid-cols-3">
              <p>Address: {data.apartments.address}</p>
              <p>City: {data.apartments.city}</p>
              <p>Unit: {data.apartments.unit}</p>
              <p>Zip: {data.apartments.zip}</p>
              <p>Rent: {data.apartments.rent} ₱</p>
              {data.apartments.occupied ? (
                <p>Occupied: True</p>
              ) : (
                <p>Occupied: False</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <ApartmentsPage apartment={data} /> */}
    </ApolloClientProvider>
  );
}
