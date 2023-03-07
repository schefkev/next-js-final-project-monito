import { gql } from '@apollo/client';
import { initializeApollo } from '../../utils/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import Tenants from './Tenants';

export default async function page() {
  const client = initializeApollo(null);

  await client.query({
    query: gql`
      query GetTenants {
        tenants {
          id
          name
          email
        }
      }
    `,
  });
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <Tenants />
    </ApolloClientProvider>
  );
}
