import { gql } from '@apollo/client';
import { initializeApollo } from '../../utils/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import Landlords from './Landlords';

export default async function page() {
  const client = initializeApollo(null);

  await client.query({
    query: gql`
      query GetLandlords {
        landlords {
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
      <Landlords />
    </ApolloClientProvider>
  );
}
