import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { initializeApollo } from '../../utils/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import LogoutButton from '../LogoutButton';
import Apartments from './Apartments';

export const dynamic = 'force-dynamic';

export default async function RegistrationPage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data } = await client.query({
    query: gql`
      query GetLoggedInUser($username: String) {
        getLoggedInUser(username: $username) {
          id
          username
          avatar
        }
      }
    `,
    variables: {
      username: sessionToken?.value,
    },
  });
  console.log('data:', data.getLoggedInUser.id);

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <div data-theme="emerald">
        <div
          key={`users-${data.getLoggedInUser.id}`}
          className="navbar bg-base-100 bg-primary-focus"
        >
          <div className="flex-1">
            <h1 className="normal-case text-xl">
              {data.getLoggedInUser.username}
            </h1>
          </div>
          <div className="flex-none gap-2">
            <Link className="flex-none mr-6 text-success" href="/logout">
              <LogoutButton />
            </Link>
            <div className="form-control">
              <input placeholder="Search" className="input input-bordered" />
            </div>
            <div className="dropdown dropdown-end">
              <label
                htmlFor="dropdown"
                // tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    src={data.getLoggedInUser.avatar}
                    alt={data.getLoggedInUser.username}
                    width={200}
                    height={200}
                  />
                </div>
              </label>
              <ul
                // tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  {/* <Link className="flex-none mr-6 text-success" href="/logout">
                    <LogoutButton />
                  </Link> */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Apartments /* userId={data.getLoggedInUser.id} */ />
    </ApolloClientProvider>
  );
}
