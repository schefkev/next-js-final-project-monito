import { gql } from '@apollo/client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteSessionByToken } from '../../../database/sessions';
import { initializeApollo } from '../../../utils/graphql';

export default async function LogoutPage() {
  const sessionToken = headers().get('x-sessionToken-to-delete');
  const client = initializeApollo(null);

  if (sessionToken) {
    await deleteSessionByToken(sessionToken);
    await client.mutate({
      mutation: gql`
        mutation logout($token: String! = "${sessionToken}"){
          logout(token: $token){
            id
          }
        }
      `,
    });
  }
  redirect('/');
}
