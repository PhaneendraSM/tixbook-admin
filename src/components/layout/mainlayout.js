import React from 'react';
import Header from './header';
import Sidebar from './sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Header />
        <main className="flex-grow-1 p-4 main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
