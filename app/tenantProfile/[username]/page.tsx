import { gql } from '@apollo/client';
import ApartmentsPage from '../../(apartments)/apartments/ApartmentByUserId';
import TenantApartmentsPage from '../../(tenants)/tenantApartment/ApartmentByTenantId';
import TenantsPage from '../../(tenants)/tenants/TenantsByUserId';
import NavBar from '../../../components/Navbar';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';

type Props = {
  params: { username: string };
};

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
  console.log('tenant:', data.tenant);
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <div className="">
        {/* ----- NAVBAR ----- */}
        <NavBar username={data.tenant.username} avatar={data.tenant.avatar} />
        {/* ----- DASHBOARD ----- */}
        {/* <ApartmentsPage userId={data.user.id} />
        <TenantsPage userId={data.user.id} /> */}
        <TenantApartmentsPage userId={data.tenant.id} />
      </div>
    </ApolloClientProvider>
  );
}
