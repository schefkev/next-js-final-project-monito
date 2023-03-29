import { gql } from '@apollo/client';
import TenantApartmentsPage from '../../(tenants)/tenantsApartment/ApartmentByTenantId';
import TenantNavBar from '../../../components/TenantNavbar';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props) {
  const client = initializeApollo(null);
  const userId = params.username;
  const { data } = await client.query({
    query: gql`
      query GetTenantsById($id: ID! = ${userId}) {
        tenant(id: $id) {
          username
        }
      }
    `,
  });

  return {
    title: data.tenant.username,
    description: `${data.tenant.username}'s user profile`,
  };
}

export default async function UserProfile({ params }: Props) {
  const client = initializeApollo(null);
  const userId = params.username;
  const { data, loading, error } = await client.query({
    query: gql`
      query GetTenantsById($id: ID! = ${userId}) {
        tenant(id: $id) {
          id
          username
          avatar
        }
      }
    `,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  if (!data.tenant) return <p>User not Found</p>;
  // console.log('tenant:', data.tenant);
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <div className="h-screen">
        {/* ----- NAVBAR ----- */}
        <TenantNavBar
          username={data.tenant.username}
          avatar={data.tenant.avatar}
        />
        {/* ----- DASHBOARD ----- */}
        <TenantApartmentsPage userId={data.tenant.id} />
      </div>
    </ApolloClientProvider>
  );
}
