import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Rental Management App</h1>
          <nav>
            <Link href="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Home</Link>
            <a href="#" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Features</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Contact</a>
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Login</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium">Register</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 py-8 text-center">
        <p className="text-gray-500">© 2025 Rental Management App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
