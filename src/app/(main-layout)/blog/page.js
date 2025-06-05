import React from 'react';
import blogImg from '@/assets/blogImg.jpg';
import Link from 'next/link';
import Image from 'next/image';

const BlogPage = () => {
  return (
    <div className='py-16 lg::py-24 bg-primary text-white'>
      <div className='container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
        <Link href={`/blog/discover-excellence-in-golf-at-gpc-golf`}>
          <div className='space-y-6'>
            <Image
              src={blogImg}
              alt='Blog Image'
              className='w-full mb-6'
            />
            <p>5/14/24</p>
            <h2 className='text-3xl lg:text-4xl font-semibold mb-4'>
              Discover Excellence in Golf at GPC Golf
            </h2>
            <p className='font-tinos mt-12 underline'>Read More</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogPage;
