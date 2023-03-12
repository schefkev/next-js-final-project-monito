import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '../app/LogoutButton';
import Logo from '../public/logo1.svg';

type Props = {
  username: string;
  avatar: string;
};

export default function NavBar(props: Props) {
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
        <Link className="flex-none mr-6 text-success" href="/logout">
          <LogoutButton />
        </Link>
        <div className="avatar">
          <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <Image src={avatar} alt={username} width={200} height={200} />
          </div>
        </div>
      </div>
    </div>
  );
}
