import { gql } from '@apollo/client';
import ApartmentsPage from '../../(apartments)/apartments/ApartmentByUserId';
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
      query GetUserById($id: ID! = ${userId}) {
        user(id: $id) {
          id
          username
          avatar
        }
      }
    `,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  if (!data.user) return <p>User not Found</p>;
  // console.log('landl.:', data.user);
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <div className="">
        {/* ----- NAVBAR ----- */}
        <NavBar username={data.user.username} avatar={data.user.avatar} />
        {/* ----- DASHBOARD ----- */}
        <ApartmentsPage userId={data.user.id} />
        {/* <TenantsPage userId={data.user.id} /> */}
      </div>
    </ApolloClientProvider>
  );
}
