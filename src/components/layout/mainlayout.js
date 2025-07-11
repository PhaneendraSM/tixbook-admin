import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminBooking = location.pathname === '/admin-booking';
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div
        className="d-flex flex-column flex-grow-1 main-layout"
        style={isAdminBooking ? { overflow: 'hidden' } : {}}
      >
        <Header />
        <main className="flex-grow-1 p-4 main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
