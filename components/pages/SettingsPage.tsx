'use client';

import React, { useState } from 'react';
import { Button } from '../Button';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    senderName: 'Bangko Maharlika',
    dailyLimit: 500,
    notificationsEmail: true,
    notificationsSMS: false,
    autoRetry: true,
    retryAttempts: 3,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application settings</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Account Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value="system@maharlikaubi.com"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value="Admin"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <input
              type="text"
              value="October 23, 2025"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* SMS Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
            <input
              type="text"
              value={settings.senderName}
              onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">How your SMS will appear to recipients</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Message Limit</label>
            <input
              type="number"
              value={settings.dailyLimit}
              onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum messages per day</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Retry Failed Messages</p>
              <p className="text-xs text-gray-600">Automatically retry failed SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRetry}
              onChange={(e) => setSettings({ ...settings, autoRetry: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
          {settings.autoRetry && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retry Attempts</label>
              <input
                type="number"
                value={settings.retryAttempts}
                onChange={(e) => setSettings({ ...settings, retryAttempts: parseInt(e.target.value) })}
                min="1"
                max="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-600">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEmail}
              onChange={(e) => setSettings({ ...settings, notificationsEmail: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-600">Receive updates via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsSMS}
              onChange={(e) => setSettings({ ...settings, notificationsSMS: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-800 mb-4">These actions cannot be undone</p>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
            Reset All Data
          </button>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          Save Changes
        </Button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
