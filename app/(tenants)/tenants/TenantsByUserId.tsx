'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Tenant } from '../../../database/tenants';

const getTenantByUserId = gql`
  query Query($userId: String) {
    tenantByUserId(userId: $userId) {
      id
      username
      avatar
    }
  }
`;
// console.log('query:', getApartmentByUserId);

export default function TenantsPage(props: { userId: number }) {
  const { loading, data, refetch } = useQuery(getTenantByUserId, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { userId: props.userId },
  });

  if (loading) return <p>Loading...</p>;
  console.log('tenant-site:', data);
  console.log('user:', props.userId);

  return (
    <div data-theme="emerald" className="h-screen">
      {data?.tenantByUserId.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center mt-24">
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-neutral">
              You have no tenants in your Dashboard, want to add your first one?
            </h3>
            <div className="text-center hover:text-primary-focus">
              <Link href="/createApartments">Create Tenants</Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {data?.tenantByUserId.map((tenant: Tenant) => {
            return (
              <div key={`apartment-${tenant.id}`}>
                <div className="card lg:card-side bg-base-100 shadow-xl">
                  <Image
                    src={tenant.avatar}
                    alt="Apartment Name"
                    width="300"
                    height="300"
                    className="object-cover"
                  />
                  <div className="card-body">
                    <h2 className="card-title text-primary underline decoration-primary-500/25">
                      {tenant.username}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
