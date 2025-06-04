'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function SearchableDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  splitTwoColumns = false,
}) {
  const [input, setInput] = useState(value || '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(input.toLowerCase())
  );

  // For splitting into two columns
  const midpoint = Math.ceil(filteredOptions.length / 2);
  const leftOptions = filteredOptions.slice(0, midpoint);
  const rightOptions = filteredOptions.slice(midpoint);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className='w-full'>
      <div className=''>
        <div className='flex h-12 w-full items-center justify-between rounded-full  bg-transparent px-3 shadow-none'>
          <input
            ref={inputRef}
            type='text'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className='flex-1 border-none bg-transparent outline-none'
          />
          <button
            type='button'
            onClick={() => {
              setOpen(!open);
              if (!open) inputRef.current?.focus();
            }}
            className='flex items-center'
          >
            <ChevronDown className='h-4 w-4 shrink-0 opacity-50' />
          </button>
        </div>

        {open && (
          <div className='absolute left-0 right-0 top-full z-10 mt-4 rounded-lg border bg-white p-4 search-box'>
            {label && (
              <h3 className='mb-2 px-2 text-left text-xs font-bold uppercase text-[rgb(67,67,67)]'>
                {label}
              </h3>
            )}

            {splitTwoColumns ? (
              <div className='grid grid-cols-1 md:grid-cols-2'>
                <div className='mr-4'>
                  <div className='flex flex-col gap-0.5'>
                    {leftOptions.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          onChange(item);
                          setInput(item);
                          setOpen(false);
                        }}
                        className='text-left hover:bg-gray-100 p-2 rounded-xs text-gray-700'
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className='border-l border-gray-200 pl-4'>
                  <div className='flex flex-col gap-0.5'>
                    {rightOptions.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          onChange(item);
                          setInput(item);
                          setOpen(false);
                        }}
                        className='text-left hover:bg-gray-100 p-2 rounded-xs text-gray-700'
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-0.5'>
                {filteredOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onChange(item);
                      setInput(item);
                      setOpen(false);
                    }}
                    className='text-left hover:bg-gray-100 p-2 rounded-xs text-gray-700'
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
