'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  user?: { username: string; role: string } | null;
  onLogout: () => void;
}

export function Navbar({ activeTab, onTabChange, user, onLogout }: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'contacts', label: 'Contacts', icon: '👥' },
    { id: 'campaign', label: 'Campaign', icon: '📢' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Blaster-Logo.svg"
              alt="SMS Blaster"
              width={110}
              height={40}
              priority
            />
          </div>

          {/* Right Section - User & Actions */}
          <div className="flex items-center gap-6">
            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
