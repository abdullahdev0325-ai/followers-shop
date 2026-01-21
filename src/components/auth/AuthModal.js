'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Login from './Login';
import Signup from './Signup';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        {mode === 'login' ? (
          <Login onSwitchToSignup={() => setMode('signup')} onClose={onClose} />
        ) : (
          <Signup onSwitchToLogin={() => setMode('login')} onClose={onClose} />
        )}
      </div>
    </div>
  );
}


