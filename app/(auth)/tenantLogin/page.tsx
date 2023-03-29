import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import TenantLoginForm from './TenantLoginForm';

export const metadata = {
  title: 'Login',
  description: 'Login to Monito, your one-in-all monitoring app',
};

export default async function LoginPage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data, loading } = await client.query({
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

  if (loading) return <button className="btn loading">loading</button>;

  if (data.getLoggedInTenant) {
    redirect(`/tenantProfile/${data.getLoggedInTenant.id}`);
  }

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <TenantLoginForm />
    </ApolloClientProvider>
  );
}
