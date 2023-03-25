/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../public/logo1.svg';
import LogoutButton from './LogoutButton';

type Props = {
  username: string;
  avatar: string;
};

export default function TenantNavBar(props: Props) {
  const { username, avatar } = props;
  return (
    <div className="navbar bg-secondary h-20">
      <div className="flex-1">
        <Link href="/">
          <Image src={Logo} alt="Logo" width="70" height="70" />
        </Link>
        <h1 className="normal-case text-xl text-info pl-6">
          Welcome Back, {username}
        </h1>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-hover dropdown-end">
          <div tabIndex={0}>
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image src={avatar} alt={username} width={200} height={200} />
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/requests">Create Request</Link>
            </li>
            <li>
              <Link
                href="/logout"
                className="flex-none mr-6 text-success"
                prefetch={false}
              >
                <LogoutButton />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
