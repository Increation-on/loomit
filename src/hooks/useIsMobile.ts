'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

const getSnapshot = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
