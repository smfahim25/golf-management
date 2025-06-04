'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Enter a valid email address' : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    // TODO: send reset email
    console.log('Send reset email to:', email);
  };

  const handleCancel = () => {
    router.push('/login');
  };

  return (
    <div className='font-sans min-h-screen flex pt-16 justify-center p-4 bg-gray-50'>
      <div className='w-full max-h-fit max-w-5xl bg-white border border-gray-200 rounded-lg'>
        <div className='px-6 py-4 border-b border-gray-200 bg-gray-100'>
          <h1 className='text-xl font-medium text-gray-900'>Reset Your Password</h1>
        </div>
        <div className='px-6 py-6 space-y-4'>
          <p className='text-gray-700 text-xl font-medium'>Enter your email below, and we will send you a reset password link to reset your password.</p>
          <form
            onSubmit={handleSubmit}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-sm font-medium text-gray-700'
              >
                Email
              </Label>
              <div className='relative'>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  onBlur={() => {
                    setTouched(true);
                    const err = validateEmail(email);
                    setError(err);
                  }}
                  className={`w-full ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                {error && touched && <AlertCircle className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500' />}
              </div>
              {error && touched && <p className='text-sm text-red-600'>{error}</p>}
            </div>

            <div className='flex space-x-4 pt-4'>
              <Button
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2'
              >
                Reset Password
              </Button>
              <Button
                type='button'
                variant='ghost'
                onClick={handleCancel}
                className='text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-6 py-2'
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
