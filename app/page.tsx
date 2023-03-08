import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import Dashboard from '../public/images/Dashboard.png';
import Maintenance from '../public/images/Maintenance.png';
import Overview from '../public/images/Overview.png';
import Service from '../public/images/Service.png';
import Logo from '../public/logo1.svg';
import { initializeApollo } from '../utils/graphql';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import RegisterButton from './RegisterButton';

export default async function HomePage() {
  const client = initializeApollo(null);
  const nextCookies = cookies();
  const sessionToken = nextCookies.get('sessionToken');

  const { data } = await client.query({
    query: gql`
      query GetLoggedInUser($username: String) {
        getLoggedInUser(username: $username) {
          username
          avatar
        }
      }
    `,
    variables: {
      username: sessionToken?.value,
    },
  });

  return (
    <div>
      <main
        data-theme="emerald"
        className="bg-[url('/images/Background.png')] bg-cover"
      >
        <div className="flex flex-row justify-between flex-1 ml-6">
          <div className="justify-start">
            <Image src={Logo} alt="Logo" width="90" height="70" />
          </div>
          <div className="items-center">
            <span className="mr-4">{data.getLoggedInUser?.username}</span>
            {data.getLoggedInUser?.username ? (
              <Link
                className="flex-none mr-6 text-success"
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
          </div>
        </div>
        {/* ----- Hero Section ----- */}
        <div className="flex flex-col gap-6 text-center justify-center items-center h-screen">
          <p className="text-4xl text-success font-mono tracking-widest">
            Welcome to Monito
          </p>
          <p className="text-xl tracking-wide">
            The Ultimate property management solution
          </p>
          <hr className="w-36 h-1 bg-neutral-500 rounded" />
          <div className="flex flex-col my-12">
            <div className="grid h-20 card rounded-box placed-items-center max-w-4xl text-l tracking-wide text-neutral">
              Our app is designed to simplify the way landlords communicate with
              their tenants and manage their properties. With Monito, you can
              easily handle all aspects of property management from the comfort
              of your computer or mobile device.
            </div>
          </div>
        </div>
        {/* ----- Card Section ----- */}
        <div className="grid grid-cols-1 gap-4 mx-12 md:grid-cols-2">
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <Image
              src={Dashboard}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-primary underline decoration-primary-500/25">
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
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <Image
              src={Maintenance}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-primary underline decoration-primary-500/25">
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
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <Image
              src={Service}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-primary underline decoration-primary-500/25">
                Mobile Access
              </h2>
              <p className="text-sm">
                Our app is designed to work on both desktop and mobile devices,
                so you can manage your properties and communicate with your
                tenants from anywhere.
              </p>
            </div>
          </div>
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <Image
              src={Overview}
              alt="Dashboard"
              width="100"
              height="100"
              className="object-cover"
            />
            <div className="card-body">
              <h2 className="card-title text-primary underline decoration-primary-500/25">
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
          <div className="grid h-20 card rounded-box placed-items-center max-w-4xl text-l tracking-wide text-neutral">
            With Monito, you'll save time and effort, reduce your workload, and
            improve tenant satisfaction. It's the ultimate property management
            solution that will take your business to the next level. So why
            wait? Sign up today and start experiencing the benefits for
            yourself!
          </div>
          <div className="grid h-20 card rounded-box placed-items-center my-16 max-w-4xl text-l tracking-wide text-neutral">
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
