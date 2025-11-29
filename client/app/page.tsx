'use client'
import React from 'react';

import AppContextProvider from '@/context/AppContext';
import HomePage from './home/page';

export default function Home() {
  return (
    <AppContextProvider>
    <HomePage />
    </AppContextProvider>

  );
}
