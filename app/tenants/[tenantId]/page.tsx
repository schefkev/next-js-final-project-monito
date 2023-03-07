import { gql } from '@apollo/client';
import Link from 'next/link';
import { initializeApollo } from '../../../utils/graphql';

type Props = {
  params: { tenantId: string };
};

export default async function LandlordPage(props: Props) {
  const client = initializeApollo(null);
  const landlordId = props.params.tenantId;

  const { data } = await client.query({
    query: gql`
      query Tenant($id: ID! = ${landlordId}) {
        tenantsById(id: $id) {
          id
          name
          email
        }
      }
    `,
  });

  return (
    <>
      <header>
        <Link href="/tenants">← Back to Tenants</Link>
      </header>

      <h1>{data?.tenantsById.name}</h1>
      <div>
        <div>
          {/*  <Image
            src={`/images/${
              data.animal.id
            }-${data.animal.firstName.toLowerCase()}.jpeg`}
            alt={data.animal.firstName}
            width={400}
            height={400}
          /> */}
          <div>
            <h2>{data.tenantsById.name}</h2>
            <p>{data.tenantsById?.email}</p>
            <p>{data.tenantsById?.id}</p>
          </div>
        </div>
      </div>
    </>
  );
}
