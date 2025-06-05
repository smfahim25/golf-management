'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';

const ContactSection = () => {
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
    <section className='bg-gray-100 text-black py-16 px-4 lg:py-24'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4'>
            Convenient for Your Time, Not Ours
          </h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
          {/* Contact Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              <h3 className='text-2xl font-bold uppercase tracking-wider text-center'>
                MESSAGE THE GREGOR:
              </h3>
              <div>
                <label className='block text-lg font-medium mb-2'>
                  Name <span className='text-gray-500'>(required)</span>
                </label>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1'>First Name</label>
                    <Input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className='!h-12 shadow-none rounded-none border-black/40'
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
                      className='!h-12 shadow-none rounded-none border-black/40'
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className='block  font-medium mb-2'>
                  Email <span className='text-gray-500'>(required)</span>
                </label>
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleFormChange}
                  className='!h-12 shadow-none rounded-none border-black/40'
                  required
                />
              </div>

              <div>
                <label className='block  font-medium mb-2'>
                  Subject <span className='text-gray-500'>(required)</span>
                </label>
                <Input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleFormChange}
                  className='!h-12 shadow-none rounded-none border-black/40'
                  required
                />
              </div>

              <div>
                <label className='block  font-medium mb-2'>
                  Message <span className='text-gray-500'>(required)</span>
                </label>
                <Textarea
                  name='message'
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={6}
                  className='w-full shadow-none rounded-none border-black/40 h-28'
                  required
                ></Textarea>
              </div>

              <button
                type='submit'
                className='bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold cursor-pointer transition-colors'
              >
                Submit
              </button>
            </form>
          </div>

          {/* Map */}
          <div className='h-fit'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2929.0240909747854!2d-83.24606612386962!3d42.766695771158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824ecc933af44f9%3A0xb5b3e9442b7889b3!2s169%20Clarkston%20Rd%2C%20Orion%20Township%2C%20MI%2048362%2C%20USA!5e0!3m2!1sen!2sbd!4v1749029759907!5m2!1sen!2sbd'
              width='400'
              height='332'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
