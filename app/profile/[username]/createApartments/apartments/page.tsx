import { gql } from '@apollo/client';
import { initializeApollo } from '../../../../../utils/graphql';
import ApolloClientProvider from '../../../../ApolloClientProvider';
import Apartments from './Apartments';

export default async function page() {
  const client = initializeApollo(null);

  await client.query({
    query: gql`
      query GetApartments {
        apartments {
          id
          name
          address
          city
          unit
          zip
          rent
          occupied
          image
        }
      }
    `,
  });
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <Apartments />
    </ApolloClientProvider>
  );
}
