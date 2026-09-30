'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    // Dev mode is skipped so a cached shell never masks hot-reloaded changes in the preview.
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return null;
}
