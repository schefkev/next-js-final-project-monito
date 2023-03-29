import { gql } from '@apollo/client';
import { initializeApollo } from '../../../../utils/graphql';
import ApolloClientProvider from '../../../ApolloClientProvider';
import ApartmentsPage from './Apartment';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    apartmentId: string;
  };
};

export async function generateMetadata(props: Props) {
  const client = initializeApollo(null);

  const { data } = await client.query({
    query: gql`
      query Query($apartmentsId: ID!) {
        apartments(id: $apartmentsId) {
          id
          name
        }
      }
    `,
    variables: {
      apartmentsId: props.params.apartmentId,
    },
  });

  return {
    title: `Dashboard - ${data.apartments.name}`,
    description: `${data.apartments.name}'s Dashboard`,
  };
}

export default async function ApartmentByIdPage(props: Props) {
  const client = initializeApollo(null);

  const { data } = await client.query({
    query: gql`
      query Query($apartmentsId: ID!) {
        apartments(id: $apartmentsId) {
          id
          occupied
        }
      }
    `,
    variables: {
      apartmentsId: props.params.apartmentId,
    },
  });

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <ApartmentsPage
        apartmentId={data.apartments.id}
        apartmentOccupation={data.apartments.occupied}
      />
    </ApolloClientProvider>
  );
}
