import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Request } from '../../../../database/requests';
import Logo from '../../../../public/logo1.svg';
import { initializeApollo } from '../../../../utils/graphql';
import ApolloClientProvider from '../../../ApolloClientProvider';

// import ApartmentsPage from './Apartment';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    tenantId: string;
  };
};
export default async function ApartmentByIdPage(props: Props) {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data: userData } = await client.query({
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

  const { data } = await client.query({
    query: gql`
      query Query($tenantId: ID!) {
        tenant(id: $tenantId) {
          id
          username
          avatar
          requests {
            id
            message
            picture
          }
        }
      }
    `,
    variables: {
      tenantId: props.params.tenantId,
    },
  });
  // console.log('data:', data);
  // console.log('userData:', userData);

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <div className="h-screen">
        <div className="navbar bg-secondary h-20">
          <div className="flex-1">
            <Link href="/">
              <Image src={Logo} alt="Logo" width="70" height="70" />
            </Link>
            <h1 className="normal-case text-xl text-info pl-6">
              {/* {data.user.username} */}
            </h1>
          </div>
          <div className="flex-none text-info">
            <Link href={`/profile/${userData.getLoggedInUser.id}`}>
              Return to Profile
            </Link>
          </div>
        </div>
        <div className="card lg:card-side bg-base-100 shadow-xl m-8 h-72">
          <Image
            src={data.tenant.avatar}
            alt="Apartment Name"
            width="300"
            height="300"
            className="object-cover"
          />
          <div className="card-body">
            <h2 className="card-title text-primary underline decoration-primary-500/25">
              {data.tenant.username}
            </h2>
            <div className="p-4">
              <p className="pb-2">1.</p>
              <p className="pb-2">1.</p>
              <p className="pb-2">1.</p>
              {data.tenant.requests.length === 0 ? (
                <p />
              ) : (
                <div>
                  <h3>Requests:</h3>
                  {data.tenant.requests.map((request: Request) => {
                    return (
                      <span key={`request-${request.id}`}>
                        {request.message}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <ApartmentsPage apartment={data} /> */}
    </ApolloClientProvider>
  );
}
