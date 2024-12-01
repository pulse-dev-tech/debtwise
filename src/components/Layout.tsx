import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '../utils/navigation';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            DebtWise
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 z-40 md:hidden bg-white dark:bg-gray-800 pt-16"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.to
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="w-6 h-6 mr-3">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed">
        <div className="p-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8 block">
            DebtWise
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.to
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="w-6 h-6 mr-3">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`md:ml-64 p-4 md:p-8 ${location.pathname !== '/' ? 'mt-16 md:mt-0' : 'mt-16 md:mt-0'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Theme Toggle */}
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
};

export default Layout;