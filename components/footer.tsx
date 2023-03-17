'use client';

import Image from 'next/image';
import Facebook from '../public/facebook.svg';
import Instagram from '../public/instagram.svg';
import Logo from '../public/logo.svg';
import Twitter from '../public/twitter.svg';

export default function Footer() {
  return (
    <footer className="footer items-center p-2 bg-secondary text-base-100">
      <div className="items-center grid-flow-col">
        <Image src={Logo} alt="Monito Logo" width="42" height="42" />
        <p>Copyright © 2023 - All right reserved</p>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <Image src={Facebook} alt="Facebook Logo" width="24" height="24" />
        <Image src={Instagram} alt="Facebook Logo" width="24" height="24" />
        <Image src={Twitter} alt="Facebook Logo" width="24" height="24" />
      </div>
    </footer>
  );
}
