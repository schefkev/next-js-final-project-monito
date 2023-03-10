import { gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import ApartmentsPage from '../../(apartments)/apartments/ApartmentByUserId';
import TenantsPage from '../../(tenants)/tenants/TenantsByUserId';
import Logo from '../../../public/logo1.svg';
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
  // console.log(data.user);
  return (
    <ApolloClientProvider
      initialApolloState={JSON.stringify(client.cache.extract())}
    >
      {/* ----- NAVBAR ----- */}
      <div data-theme="emerald">
        <div className="navbar bg-primary-focus">
          <div className="flex-1">
            <Link href="/">
              <Image src={Logo} alt="Logo" width="70" height="70" />
            </Link>
            <h1 className="normal-case text-xl pl-6">
              Welcome back, {data.user.username}
            </h1>
          </div>
          <div className="flex-none gap-2">
            <Link className="flex-none mr-6 text-success" href="/logout">
              <LogoutButton />
            </Link>
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src={data.user.avatar}
                  alt={data.user.username}
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ----- DASHBOARD ----- */}
      <ApartmentsPage userId={data.user.id} />
      <TenantsPage userId={data.user.id} />
    </ApolloClientProvider>
  );
}
