import './globals.css';
import Footer from '../components/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head /> <head />
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
