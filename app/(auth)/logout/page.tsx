import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteSessionByToken } from '../../../database/sessions';

export default async function LogoutPage(token: string) {
  const sessionToken = headers().get('sessionToken');

  if (sessionToken) {
    // FIXME: Delete session from `sessions` database table for real
    if (sessionToken) {
      await deleteSessionByToken(sessionToken);
    }
    console.log('session token:', sessionToken);
  }
  redirect('/');
}
