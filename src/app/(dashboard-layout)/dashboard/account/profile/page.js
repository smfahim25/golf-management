'use client';

import { UserCircle2 } from 'lucide-react';
import React, { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    firstName: 'Mithun',
    lastName: 'Mithun',
    email: 'chakrabortypranto39@gmail.com',
    password: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (profileImage) {
      data.append('profileImage', profileImage);
    }

    // Sample submission log
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    alert('FormData submitted! Check console for keys/values.');
    // Example: await axios.post('/api/update-profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const handleReset = () => {
    setFormData({
      firstName: 'Mithun',
      lastName: 'Mithun',
      email: 'chakrabortypranto39@gmail.com',
      password: '',
    });
    setProfileImage(null);
    setPreviewImage(null);
  };

  const handleManageSubscription = () => {
    alert('Manage Subscription functionality would go here!');
  };

  return (
    <div className='flex items-center justify-center py-10 p-4 bg-white'>
      <div className=''>
        <div className='flex flex-col items-center mb-6'>
          <div className='w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center'>
            {previewImage ? (
              <img
                src={previewImage}
                alt='Preview'
                className='object-cover w-full h-full'
              />
            ) : (
              <UserCircle2 className='w-24 h-24 text-gray-500' />
            )}
          </div>
          <label className='bg-blue-600 text-white px-4 py-2.5  rounded-sm  cursor-pointer hover:bg-blue-700 cursor-pointer'>
            <span>Select Profile Photo</span>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='firstName' className='block text-sm font-medium mb-1 text-gray-700'>
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='lastName' className='block text-sm font-medium mb-1 text-gray-700'>
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium mb-1 text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-medium mb-1 text-gray-700'>
              Password{' '}
              <span className='text-xs text-gray-500'>(Leave blank to keep the same password)</span>
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-4 py-2.5  rounded-sm  cursor-pointer hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
            >
              Save
            </button>
            <button
              type='button'
              className='bg-gray-500 text-white px-4 py-2.5  rounded-sm  cursor-pointer hover:bg-gray-600 focus:ring-2 focus:ring-gray-500'
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type='button'
              className='bg-primary text-white px-4 py-2.5  rounded-sm  cursor-pointer hover:bg-primary/90 focus:ring-2 focus:ring-primary'
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
