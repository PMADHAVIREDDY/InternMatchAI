// frontend/src/components/AppWrapper.jsx
import React from 'react';
import Header from './Header.jsx';

const AppWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#171C1C] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
};

export default AppWrapper;