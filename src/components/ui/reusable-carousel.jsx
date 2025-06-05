'use client';

import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ReusableCarousel({
  images = [],
  autoplay = true,
  duration = 1500,
  loop = true,
  showControls = true,
  stopOnInteraction = false,
  columns = {
    default: 2,
    sm: 3,
    md: 5,
    lg: 10,
  },
  showTitles = true,
  className = '',
  itemClassName = '',
  aspectRatio = 'square', // "square", "video", "portrait", "landscape"
  pauseOnHover = false,
  direction = 'ltr', // "ltr" (left to right) or "rtl" (right to left)
  controlClassName = 'bg-white/50 hover:bg-white/80 text-gray-800 w-16 rounded h-12',
}) {
  // Create autoplay plugin with custom options
  const plugin = React.useRef(
    Autoplay({
      delay: duration,
      stopOnInteraction: stopOnInteraction,
      jump: false,
    })
  );

  // Handle pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover && autoplay) {
      plugin.current.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && autoplay) {
      plugin.current.reset();
    }
  };

  // Get responsive column classes
  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return `basis-1/${columns}`;
    }

    const { default: defaultCols, sm, md, lg } = columns;
    return `basis-1/${defaultCols} sm:basis-1/${sm} md:basis-1/${md} lg:basis-1/${lg}`;
  };

  // Get aspect ratio classes
  // const getAspectRatioClass = () => {
  //   switch (aspectRatio) {
  //     case 'video':
  //       return 'aspect-video';
  //     case 'portrait':
  //       return 'aspect-[3/4]';
  //     case 'landscape':
  //       return 'aspect-[4/3]';
  //     default:
  //       return 'aspect-square';
  //   }
  // };

  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className='w-full max-w-7xl mx-auto p-4'>
        <div className='text-center text-muted-foreground'>No images provided for carousel</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Carousel
        dir={direction} // Required for correct Embla behavior
        plugins={autoplay ? [plugin.current] : []}
        opts={{
          align: 'start',
          loop: loop,
          direction: direction, // Embla internal logic
          slidesToScroll: 1,
        }}
        className={cn('w-full', direction === 'rtl' && 'rtl')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {images.map((imageUrl, index) => (
            <CarouselItem
              key={index}
              className={`pl-2 md:pl-4 ${getColumnClasses()} ${itemClassName}`}
            >
              <div className='overflow-hidden'>
                <div className='p-2'>
                  <div className={`relative`}>
                    <Image
                      src={imageUrl || '/placeholder.svg'}
                      alt={`Carousel item ${index + 1}`}
                      width={500}
                      height={500}
                      className='w-auto h-36 object-contain mx-auto'
                      loading='lazy'
                    />
                    {showTitles && <div className='absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs'>Item {index + 1}</div>}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showControls && (
          <>
            <CarouselPrevious className={cn(controlClassName, 'absolute left-0 top-1/2 transform -translate-y-1/2 z-10')} />
            <CarouselNext className={cn(controlClassName, 'absolute right-0 top-1/2 transform -translate-y-1/2 z-10')} />
          </>
        )}
      </Carousel>
    </div>
  );
}
