'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg" />
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-primary dark:from-slate-100 dark:to-primary bg-clip-text text-transparent">
              WhatsApp Receptionist
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link href="/dashboard" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/services" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                  Services
                </Link>
                <Link href="/staff" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                  Staff
                </Link>
                <Link href="/bookings" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                  Bookings
                </Link>
                
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-slate-700">
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{user.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              Dashboard
            </Link>
            <Link href="/services" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              Services
            </Link>
            <Link href="/staff" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              Staff
            </Link>
            <Link href="/bookings" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              Bookings
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}