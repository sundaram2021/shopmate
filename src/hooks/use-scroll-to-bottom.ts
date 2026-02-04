'use client';

import { useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, deps);

  return ref;
}
