'use client';

import mainLogo from '@/assets/full_logo_white.webp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    // Add more password validation if needed (e.g., length)
    // else if (formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    // }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully:', formData);
      // TODO: Replace with actual login API call
      // alert('Login attempt with: ' + JSON.stringify(formData));
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side - Login Form */}
      <div className='flex items-center justify-center p-8 bg-gray-50'>
        <div className='w-full space-y-8 px-12'>
          <div className='text-center space-y-2'>
            <h1 className='font-sans font-bold text-3xl tracking-wider text-gray-900 uppercase'>WELCOME TO</h1>
            <h2 className='text-4xl font-sans font-bold text-gray-500 mb-2'>The Gregor Club</h2>
            <p className='font-sans  text-gray-900 font-medium'>please login below</p>
          </div>

          <form
            className='space-y-6'
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <Label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 font-sans mb-1'
              >
                Email
              </Label>
              <div className='relative'>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-2 pl-3 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500 pr-10' : 'border-gray-300 focus:ring-blue-500 pr-3'}`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    <svg
                      className='h-5 w-5 text-red-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p
                  id='email-error'
                  className='text-red-500 font-sans text-sm mt-1'
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 font-sans mb-1'
              >
                Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-2 pl-3 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500 pr-10' : 'border-gray-300 focus:ring-blue-500 pr-3'}`}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    <svg
                      className='h-5 w-5 text-red-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.password && (
                <p
                  id='password-error'
                  className='text-red-500 font-sans text-sm mt-1'
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className='flex items-center space-x-4'>
              <Button
                type='submit'
                className='bg-blue-600 font-sans cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium'
              >
                Login
              </Button>
              <Link
                href='/register'
                className='text-blue-600 font-sans hover:text-blue-800 text-sm font-medium underline'
              >
                Register
              </Link>
              <Link
                href='/forgot-password'
                className='text-blue-600 font-sans hover:text-blue-800 text-sm font-medium underline'
              >
                Forgot Password
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className='hidden lg:flex items-center justify-center bg-[#1F2822] relative'>
        <Image
          src={mainLogo}
          alt='The Gregor Club'
          width={800}
          height={800}
          className='w-96'
        />
      </div>
    </div>
  );
}
