import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import RegisterButton from '../components/RegisterButton';
import Dashboard from '../public/images/Dashboard.png';
import Maintenance from '../public/images/Maintenance.png';
import Overview from '../public/images/Overview.png';
import Service from '../public/images/Service.png';
import Logo from '../public/logo1.svg';
import { initializeApollo } from '../utils/graphql';

export const metadata = {
  title: 'Home',
  description:
    'The ultimate all-in-one property management solution application',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data } = await client.query({
    query: gql`
      query GetLoggedInUser($username: String) {
        getLoggedInUser(username: $username) {
          id
          username
          avatar
        }
      }
    `,
    variables: {
      username: sessionToken?.value,
    },
  });
  // console.log(data);
  return (
    <div data-theme="mytheme">
      <main className="bg-[url('/images/Background.jpg')] bg-cover">
        <div className="flex flex-row justify-between flex-1 mx-12">
          <div className="items-center">
            <Image src={Logo} alt="Logo" width="90" height="70" />
          </div>
          <div className="justify-start mt-4 text-info">
            {data.getLoggedInUser?.username ? (
              <Link
                className="flex-none mr-6 text-info"
                href="/logout"
                prefetch={false}
              >
                <LogoutButton />
              </Link>
            ) : (
              <Link className="flex-none mr-6 text-success" href="/login">
                <LoginButton />
              </Link>
            )}
            <Link href={`/profile/${data.getLoggedInUser?.id}`}>
              <span className="mr-4">{data.getLoggedInUser?.username}</span>
            </Link>
          </div>
        </div>
        {/* ----- Hero Section ----- */}
        <div className="flex flex-col gap-6 text-center justify-center items-center ">
          <p className="text-4xl text-accent font-mono tracking-widest mt-12">
            Welcome to Monito
          </p>
          <p className="text-xl text-info tracking-wide mt-12">
            The Ultimate property management solution
          </p>
          <hr className="w-36 h-1 bg-accent rounded mt-6" />
          <div className="flex flex-col my-12">
            <div className="grid h-20 card rounded-box placed-items-center max-w-4xl text-l tracking-wide text-info">
              Our app is designed to simplify the way landlords communicate with
              their tenants and manage their properties. With Monito, you can
              easily handle all aspects of property management from the comfort
              of your computer or mobile device.
            </div>
          </div>
        </div>
        {/* ----- Card Section ----- */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 mx-12 mt-12 md:grid-cols-2">
          <div className="card lg:card-side bg-info shadow-xl">
            <Image
              src={Dashboard}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-success underline decoration-primary-500/25">
                Dashboard
              </h2>
              <p className="text-sm">
                Our app also provides landlords with access to important
                information about their properties and tenants, giving you the
                ability to view a summary of all your tenants and get detailed
                information on each one, including their information and any
                service requests they have submitted.
              </p>
            </div>
          </div>
          <div className="card lg:card-side bg-info shadow-xl">
            <Image
              src={Maintenance}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-success underline decoration-primary-500/25">
                Maintenance
              </h2>
              <p className="text-sm">
                Our innovative platform allows tenants to submit service
                requests directly through the app, providing landlords with
                instant notifications when something needs attention. This means
                that you can keep your tenants happy, and stay on top of
                property maintenance to avoid costly repairs down the road.
              </p>
            </div>
          </div>
          <div className="card lg:card-side bg-info shadow-xl">
            <Image
              src={Service}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-success underline decoration-primary-500/25">
                Mobile Access
              </h2>
              <p className="text-sm">
                Our app is designed to work on both desktop and mobile devices,
                so you can manage your properties and communicate with your
                tenants from anywhere.
              </p>
            </div>
          </div>
          <div className="card lg:card-side bg-info shadow-xl">
            <Image
              src={Overview}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-success underline decoration-primary-500/25">
                Overview
              </h2>
              <p className="text-sm">
                Our app allows you to view basic information about your
                properties, such as the number of units, address, and rent
                amounts, all from within the app. You can also add or remove
                properties as needed.
              </p>
            </div>
          </div>
        </div>
        {/* ----- Conclusion Section ------ */}
        <div className="flex flex-col justify-center items-center mt-12 lg:px-8">
          <div className="grid h-20 card rounded-box placed-items-center max-w-4xl text-l tracking-wide text-info">
            With Monito, you'll save time and effort, reduce your workload, and
            improve tenant satisfaction. It's the ultimate property management
            solution that will take your business to the next level. So why
            wait? Sign up today and start experiencing the benefits for
            yourself!
          </div>
          <div className="grid h-20 card rounded-box placed-items-center my-16 max-w-4xl text-l tracking-wide text-info">
            Our app is designed with security in mind, with robust
            authentication and access controls that ensure only authorized users
            have access to sensitive data. And with our user-friendly interface,
            you don't need any technical expertise to get started – it's
            intuitive and easy to use!
          </div>
          {/* ----- Sign Up Button ----- */}
          <Link href="/register" className="mb-16">
            <RegisterButton />
          </Link>
        </div>
      </main>
    </div>
  );
}
