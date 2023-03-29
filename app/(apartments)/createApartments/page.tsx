import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import ApartmentForm from './ApartmentForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Create Apartment',
  description: 'Create your Apartment and assign a Tenant to the apartment.',
};

export default async function CreateApartmentPage() {
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

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <ApartmentForm userId={userData.getLoggedInUser.id} />
    </ApolloClientProvider>
  );
}
