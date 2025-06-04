import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const AuthorCard = ({ img, name, designation, className }) => {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <Image
        src={img}
        alt={name}
        width={40}
        height={40}
        className='rounded-full object-cover object-center aspect-square w-[32px] h-[32px] sm:h-[40px] sm:w-[40px]'
      />
      <div>
        <h3 className='text-sm md:text-base lg:text-[17px] font-bold'>{name}</h3>
        <p className='text-xs md:text-[13px] text-gray-600'>{designation}</p>
      </div>
    </div>
  );
};

export default AuthorCard;
