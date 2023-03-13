import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import TenantLoginForm from './TenantLoginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default async function page(props: Props) {
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
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <TenantLoginForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
