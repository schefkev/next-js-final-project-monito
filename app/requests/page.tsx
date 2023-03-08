import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../../utils/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import RequestsForm from './RequestsForm';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data } = await client.query({
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
  // console.log(data);

  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <RequestsForm userId={data.getLoggedInUser.id} />
    </ApolloClientProvider>
  );
}
