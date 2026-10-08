import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import { fetchHealth } from './api/client';

export default function App() {
  const [backendHealth, setBackendHealth] = useState(null);
  const [totalCatalogCount, setTotalCatalogCount] = useState(50);

  const checkHealth = useCallback(async () => {
    const data = await fetchHealth();
    setBackendHealth(data);
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const handleScrollToCatalog = () => {
    const el = document.querySelector('section[ref]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <AppLayout 
        backendHealth={backendHealth} 
        totalWords={totalCatalogCount}
        onScrollToCatalog={handleScrollToCatalog}
      >
        <HomePage onCatalogCountUpdate={(count) => setTotalCatalogCount(count)} />
      </AppLayout>
    </AuthProvider>
  );
}
