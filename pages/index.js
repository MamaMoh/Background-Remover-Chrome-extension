import React, { useState } from 'react';
import Index from '../components/Index';

export default function Home() {
  const [activePage, setActivePage] = useState('index');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const navigateToPage = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
    </>
  );
}
