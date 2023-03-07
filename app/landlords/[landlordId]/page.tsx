import { gql } from '@apollo/client';
import Link from 'next/link';
import { initializeApollo } from '../../../utils/graphql';

type Props = {
  params: { landlordId: string };
};

export default async function LandlordPage(props: Props) {
  const client = initializeApollo(null);
  const landlordId = props.params.landlordId;

  const { data } = await client.query({
    query: gql`
      query Landlord($id: ID! = ${landlordId}) {
        landlordsById(id: $id) {
          id
          name
          email
        }
        tenantRequests{
          tenantName
          requestMessage
        }
      }
    `,
  });

  return (
    <>
      <header>
        <Link href="/landlords">← Back to Landlords</Link>
      </header>

      <h1>{data?.landlordsById.name}</h1>
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
            <h2>{data.landlordsById.name}</h2>
            <p>{data.landlordsById?.email}</p>
            <p>{data.landlordsById?.id}</p>
            <p>{data.tenantRequests?.requestMessage}</p>
          </div>
        </div>
      </div>
    </>
  );
}
