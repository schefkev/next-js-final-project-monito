import ApolloClientProvider from '../../ApolloClientProvider';
import AdminDashboard from './AdminDashboard';

export default function Page() {
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <AdminDashboard />
    </ApolloClientProvider>
  );
}
