import ApolloClientProvider from '../../ApolloClientProvider';
import RegistrationForm from './RegisterForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default function RegistrationPage(props: Props) {
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <RegistrationForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
