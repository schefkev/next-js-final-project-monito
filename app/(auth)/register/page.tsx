import ApolloClientProvider from '../../ApolloClientProvider';
import RegistrationForm from './RegisterForm';

export const metadata = {
  title: 'Register',
  description: 'Register to Monito, your one-in-all monitoring app',
};

type Props = { searchParams: { returnTo?: string | string[] } };

export default function RegistrationPage(props: Props) {
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <RegistrationForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
