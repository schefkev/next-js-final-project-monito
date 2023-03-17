import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import TenantApartmentsPage from './ApartmentByTenantId';

export const dynamic = 'force-dynamic';

export default async function ApartmentByIdPage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data } = await client.query({
    query: gql`
      query GetLoggedInUser($username: String) {
        getLoggedInTenant(username: $username) {
          id
        }
      }
    `,
    variables: {
      username: sessionToken?.value,
    },
  });
  // console.log('data:', data.getLoggedInTenant.id);

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <TenantApartmentsPage userId={data.getLoggedInTenant.id} />
    </ApolloClientProvider>
  );
}
