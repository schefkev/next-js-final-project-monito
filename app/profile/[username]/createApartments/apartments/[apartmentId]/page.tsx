import ApolloClientProvider from '../../../../../ApolloClientProvider';
import SingleApartment from './SingleApartment';

type Props = {
  params: {
    apartmentId: string;
  };
};

export default function ApartmentPage(props: Props) {
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <SingleApartment apartmentId={props.params.apartmentId} />
    </ApolloClientProvider>
  );
}
