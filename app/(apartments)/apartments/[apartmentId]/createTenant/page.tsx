import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { initializeApollo } from '../../../../../utils/graphql';
import ApolloClientProvider from '../../../../ApolloClientProvider';
import TenantForm from './TenantForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Create Tenant',
  description: 'Create your Tenant and assign him to the assigned apartment.',
};

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

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <TenantForm
        userId={userData.getLoggedInUser.id}
        apartmentId={aptData.apartments.id}
      />
    </ApolloClientProvider>
  );
}
