'use client';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Tenant } from '../../database/tenants';

export type TenantResponse = {
  tenants: Tenant[];
};

const getTenants = gql`
  query GetTenants {
    tenants {
      id
      name
      email
    }
  }
`;

export default function Tenants() {
  const { loading, error, data, refetch } = useQuery(getTenants, {
    onCompleted: async () => {
      await refetch;
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Landlords</h1>

      {data?.tenants.map((tenants: Tenant) => {
        return (
          <div key={`tenant-${tenants.id}`}>
            <h2>
              <Link href={`/tenants/${tenants.id}`}>{tenants.name}</Link>
            </h2>

            <Link href={`/tenants/${tenants.id}`}>
              {/*  <Image
                src={`/images/${
                  animal.id
                }-${animal.firstName.toLowerCase()}.jpeg`}
                alt=""
                width="200"
                height="200"
              /> */}
            </Link>

            <p>Email: {tenants.email}</p>
            <p>ID: {tenants.id}</p>
          </div>
        );
      })}
    </>
  );
}
