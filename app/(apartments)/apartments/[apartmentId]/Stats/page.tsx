import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../../../../../utils/graphql';
import ApolloClientProvider from '../../../../ApolloClientProvider';
import StatisticsForm from './Stats';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    apartmentId: string;
  };
};

export default async function StatisticsPage(props: Props) {
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

  const { data: aptData } = await client.query({
    query: gql`
      query ApartmentId($apartmentsId: ID!) {
        apartments(id: $apartmentsId) {
          id
        }
      }
    `,
    variables: {
      apartmentsId: props.params.apartmentId,
    },
  });

  console.log('User:', userData);
  console.log('Apartment:', aptData);

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <StatisticsForm
        userId={userData.getLoggedInUser.id}
        apartmentId={aptData.apartments.id}
      />
    </ApolloClientProvider>
  );
}
