import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login',
  description: 'Login to Monito, your one-in-all monitoring app',
};

export default async function LoginPage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data, loading } = await client.query({
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

  if (loading) return <button className="btn loading">loading</button>;

  if (data.getLoggedInUser) {
    redirect(`/profile/${data.getLoggedInUser.id}`);
  }
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <LoginForm />
    </ApolloClientProvider>
  );
}
