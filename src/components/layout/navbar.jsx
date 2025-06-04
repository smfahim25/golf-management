import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  return (
    <header className='container flex items-center justify-between py-6'>
      <Link href='/' className='text-4xl font-bold'>
        Logo
      </Link>
      <Link href='/blogs'>
        <Button className='!px-7 !py-6 rounded-[8px] font-semibold text-sm cursor-pointer'>
          Blog <ArrowUpRight className='h-5 w-5 stroke-2' />
        </Button>
      </Link>
    </header>
  );
};

export default Navbar;
