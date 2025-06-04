import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlogCard = ({
  id,
  image,
  title,
  date,
  category = '',
  isScrollable = false,
}) => {
  return (
    <div
      className={cn(
        'w-full flex-shrink-0 overflow-hidden transition-transform hover:translate-y-[-4px]',
        isScrollable && 'w-[280px] md:min-w-1/2 lg:min-w-1/3'
      )}
    >
      <Link href={`/blogs/${id}`} className='block'>
        <div className='relative h-[285px] w-full md:h-56'>
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            fill
            className='object-cover transition-transform duration-300 hover:scale-105 rounded-[8px] max-h-[285px]'
          />
          {category && <p className='z-10 bg-gold absolute -bottom-4 right-6 px-4 py-2 text-sm font-semibold text-white rounded-2xl'>{category}</p>}
        </div>
        <div className='py-5'>
          <p className='mb-2 text-xs font-medium text-gold'>{date}</p>
          <h3 className='mb-4 sm:text-lg md:text-xl font-semibold leading-snug'>
            {title}
          </h3>
          <p className='flex items-center text-sm font-semibold uppercase tracking-wider text-gold'>
            LEARN MORE <ArrowRight className='ml-2 h-4 w-4' />
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
