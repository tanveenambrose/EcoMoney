'use client'
import HomePage from '@/app/home/page'
import AppContextProvider from '@/context/AppContext';

export default function Home() {
  return (
    <AppContextProvider>
    <HomePage />
    </AppContextProvider>

  );
}
