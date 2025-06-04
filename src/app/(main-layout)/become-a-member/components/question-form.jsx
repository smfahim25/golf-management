'use client';
import Gallery from '@/assets/Slide8.jpeg';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useState } from 'react';

export function AskQuestionForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className='bg-primary text-white py-16 px-4 lg:py-24'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
          {/* Gallary */}
          <div className='h-fit'>
            <Image
              src={Gallery}
              width={500}
              height={300}
              alt='gallery image'
              className='w-full h-auto'
            />
          </div>

          {/* question Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              <h3 className='text-2xl font-bold uppercase tracking-wider text-left'>QUESTIONS:</h3>
              <div>
                <label className='block text-lg font-medium mb-2'>
                  Name <span className='text-gray-200'>(required)</span>
                </label>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1'>First Name</label>
                    <Input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className='!h-12 shadow-none rounded-none  bg-white text-black !text-lg'
                      required
                    />
                  </div>
                  <div>
                    <label className='block mb-1'>Last Name</label>
                    <Input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className='!h-12 shadow-none rounded-none  bg-white text-black !text-lg'
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className='block  font-medium mb-2'>
                  Email <span className='text-gray-200'>(required)</span>
                </label>
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleFormChange}
                  className='!h-12 shadow-none rounded-none  bg-white text-black !text-lg'
                  required
                />
              </div>

              <div>
                <label className='block  font-medium mb-2'>
                  Question <span className='text-gray-200'>(required)</span>
                </label>
                <p className='text-gray-200 mb-3'>Note: Responses occasionally re-direct to SPAM folder</p>
                <Textarea
                  name='message'
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={6}
                  className='w-full shadow-none rounded-none  bg-white text-black !text-lg h-[100px]'
                  required
                ></Textarea>
              </div>

              <button className=' bg-white text-xl md:text-2xl font-tions text-primary px-12 py-6  cursor-pointer transition-colors'>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
