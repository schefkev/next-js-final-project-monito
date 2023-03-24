import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../../utils/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import StatisticsForm from './StatisticsPage';

export default async function StatisticsPage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data: userData } = await client.query({
    query: gql`
      query getLoggedInUser($username: String) {
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
      <StatisticsForm userId={userData.getLoggedInUser.id} />
    </ApolloClientProvider>
  );
}
