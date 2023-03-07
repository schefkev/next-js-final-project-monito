import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '../../../database/users';
import { initializeApollo } from '../../../utils/graphql';
import ApolloClientProvider from '../../ApolloClientProvider';
import LogoutButton from '../../LogoutButton';

type Props = {
  params: { username: string };
};

export default async function UserProfile({ params }: Props) {
  const client = initializeApollo(null);
  const userId = params.username;
  const { data, loading, error } = await client.query({
    query: gql`
      query GetUserById($id: ID! = ${userId}) {
        user(id: $id) {
          id
          username
          avatar
        }
      }
    `,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;
  if (!data.user) return <p>User not Found</p>;
  /*  console.log(data.user); */
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      <div data-theme="emerald">
        <div
          key={`users-${data.user.id}`}
          className="navbar bg-base-100 bg-primary-focus"
        >
          <div className="flex-1">
            <h1 className="normal-case text-xl">{data.user.username}</h1>
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
                    src={data.user.avatar}
                    alt={data.user.username}
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
                  {/* <Link className="flex-none mr-6 text-success" href="/">
                        <LogoutButton />
                      </Link> */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        You have no appartments in your dashboard, want to add your first
        apartment?
      </div>
      <button>Add Apartment</button>
    </ApolloClientProvider>
  );
}
