import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../utils/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import RequestsForm from './RequestsForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Request',
  description:
    'Create a request for your apartment and send it to the landlord.',
};

export default async function RequestsPage() {
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

  const { data: tenantData } = await client.query({
    query: gql`
      query ApartmentId($tenantId: ID) {
        tenant(id: $tenantId) {
          apartmentId
        }
      }
    `,
    variables: {
      tenantId: data.getLoggedInTenant.id,
    },
  });

  /*  if (data.getLoggedInTenant) {
    redirect(`/tenantProfile/${data.getLoggedInTenant.id}`);
  } */

  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <RequestsForm
        userId={data.getLoggedInTenant.id}
        apartmentId={tenantData.tenant.apartmentId}
      />
    </ApolloClientProvider>
  );
}
