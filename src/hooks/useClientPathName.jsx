'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useClientPathname() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null until mounted to avoid mismatch
  return mounted ? pathname : null;
}
