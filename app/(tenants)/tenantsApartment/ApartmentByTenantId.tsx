'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Apartment } from '../../../database/apartments';
import { Request } from '../../../database/requests';

const getTenantWithApartment = gql`
  query Query($tenantId: String) {
    apartmentByTenantId(tenantId: $tenantId) {
      id
      name
      address
      city
      unit
      zip
      rent
      image
    }
  }
`;

const getRequestByTenant = gql`
  query Query($tenantId: String) {
    requestByTenantId(tenantId: $tenantId) {
      message
      picture
    }
  }
`;

export default function TenantApartmentsPage(props: { userId: number }) {
  const { loading, data, refetch } = useQuery(getTenantWithApartment, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { tenantId: props.userId },
  });

  const { data: requestData } = useQuery(getRequestByTenant, {
    onCompleted: async () => {
      await refetch();
    },
    variables: { tenantId: props.userId },
  });

  if (loading) return <p>Loading...</p>;
  // console.log('apartment-site:', data);
  // console.log('user:', props.userId);
  console.log('request:', requestData);

  return (
    <div className="">
      {data?.apartmentByTenantId.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center mt-24">
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-neutral">
              You have no appartments in your Dashboard, want to add your first
              one?
            </h3>
            <div className="text-center hover:text-primary-focus">
              <Link href="/createApartments">Create Apartment</Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {data?.apartmentByTenantId.map((apartment: Apartment) => {
            return (
              <div key={`apartment-${apartment.id}`}>
                <div className="card lg:card-side bg-base-100 shadow-xl m-8">
                  <Image
                    src={apartment.image}
                    alt="Apartment Name"
                    width="300"
                    height="300"
                    className="object-cover"
                  />
                  <div className="card-body">
                    <h2 className="card-title text-primary underline decoration-primary-500/25">
                      {apartment.name}
                    </h2>
                    <p>Address: {apartment.address}</p>
                    <p>Unit: {apartment.unit}</p>
                    <p>City: {apartment.city}</p>
                    <p>Zip Code: {apartment.zip}</p>
                    <p>Rent: {apartment.rent} ₱</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div>
        {requestData?.requestByTenantId.map((request: Request) => {
          return (
            <div key={`request-${request.id}`}>
              <div className="card lg:card-side bg-base-100 shadow-xl m-8">
                <Image
                  src={request.picture}
                  alt="Request Picture"
                  width="300"
                  height="300"
                  className="object-cover"
                />
                <div className="card-body">
                  <h2 className="card-title text-primary underline decoration-primary-500/25">
                    Service Request Message
                  </h2>
                  <p>{request.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
