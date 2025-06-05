'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function ContactForm() {
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
      <div className='w-[70%] mx-auto py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24'>
          {/* Gallary */}
          <div className='h-fit'>
            <h2 className='text-4xl sm:text-6xl mb-8'>Contact Us.</h2>
            <div className='space-y-4 text-2xl'>
              <a
                href='mailto:access@gpcgolf.com'
                className='inline-block underline underline-offset-4 font-tions'
              >
                access@gpcgolf.com
              </a>
              <p className='font-tions'>169w. Clarkston Rd.</p>
              <p className='font-tions'>Lake Orion, MI 48362</p>
            </div>
          </div>

          {/* question Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              <div>
                <label className='block text-2xl font-medium mb-2'>
                  Name <span className='text-gray-200'>(required)</span>
                </label>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1 text-xl'>First Name</label>
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
                    <label className='block mb-1 text-xl'>Last Name</label>
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
                <label className='block  text-xl font-medium mb-2'>
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
                <label className='block  text-xl font-medium mb-2'>
                  Subject <span className='text-gray-200'>(required)</span>
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
                <label className='block  text-xl font-medium mb-2'>
                  Message <span className='text-gray-200'>(required)</span>
                </label>
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
