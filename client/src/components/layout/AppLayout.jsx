import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children, backendHealth, totalWords, onScrollToCatalog }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-indigo-500 selection:text-white">
      <Navbar 
        backendHealth={backendHealth} 
        totalWords={totalWords} 
        onScrollToCatalog={onScrollToCatalog} 
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <Footer backendHealth={backendHealth} />
    </div>
  );
}
