'use client';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  className = '',
  totalItems = 0,
  itemsPerPage = 10,
  siblingsCount = 1,
  ...props
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current page from query params
  const currentPage = React.useMemo(() => {
    const page = Number(searchParams.get('page'));
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  // Function to update page in URL
  const onPageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`${pathname}?${params.toString()}`);
  };

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 640px)');

  const responsiveSiblingsCount = React.useMemo(() => {
    if (isDesktop) return siblingsCount;
    if (isTablet) return Math.min(siblingsCount, 1);
    return 0;
  }, [isDesktop, isTablet, siblingsCount]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const totalPageNumbers = responsiveSiblingsCount * 2 + 3;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - responsiveSiblingsCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + responsiveSiblingsCount,
      totalPages
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * responsiveSiblingsCount;
      return Array.from({ length: leftItemCount }, (_, i) => i + 1).concat([
        '...',
        totalPages,
      ]);
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * responsiveSiblingsCount;
      return [1, '...'].concat(
        Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        )
      );
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [1, '...'].concat(
        Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        ['...', totalPages]
      );
    }

    return [];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 lg:flex-row',
        className
      )}
      {...props}
    >
      <div className='flex flex-wrap items-center justify-center gap-2 lg:gap-3'>
        <Button
          size='icon'
          className={cn(
            'h-8 w-8 lg:h-10 lg:w-10 border-border cursor-pointer rounded-[4px]',
            currentPage === 1 ? 'hidden' : ''
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant='outline'
                size='icon'
                className='h-8 w-8 lg:h-10 lg:w-10 border-border cursor-pointer rounded-[4px]'
                disabled
              >
                ...
              </Button>
            );
          }

          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? 'default' : 'outline'}
              size='icon'
              className={cn(
                'h-8 w-8 lg:h-10 lg:w-10 border-border cursor-pointer rounded-[4px]',
                currentPage === page ? 'bg-primary text-white' : ''
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          size='icon'
          className={cn(
            'h-8 lg:h-10 border-border cursor-pointer rounded-[4px]',
            isDesktop ? 'w-fit px-4' : 'w-8 lg:w-10'
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {isDesktop && 'Next'} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
