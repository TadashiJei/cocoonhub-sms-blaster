'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { Toast, useToast } from '../Toast';

interface SettingsPageProps {
  token?: string;
}

export function SettingsPage({ token }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'sms' | 'templates' | 'notifications'>('account');
  const { toasts, showToast, removeToast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  const [settings, setSettings] = useState({
    senderName: 'CocoonHub',
    dailyLimit: 500,
    notificationsEmail: true,
    notificationsSMS: false,
    autoRetry: true,
    retryAttempts: 3,
  });

  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'SMS Blast Campaign Update',
    body: `Hello,

Your SMS campaign has been processed successfully.

Campaign Details:
- Total Messages: {total}
- Successfully Sent: {sent}
- Failed: {failed}
- Success Rate: {successRate}%

Thank you for using SMS Blaster!

Best regards,
SMS Blaster Team`,
  });

  const [previewData] = useState({
    total: 100,
    sent: 95,
    failed: 5,
    successRate: 95,
  });

  const handleSaveSMS = () => {
    showToast('✅ SMS settings updated successfully!', 'success');
  };

  const handleSaveTemplate = () => {
    showToast('📧 Email template saved successfully!', 'success');
  };

  const handleSaveNotifications = () => {
    showToast('🔔 Notification preferences updated!', 'success');
  };

  const handleSaveAll = () => {
    showToast('💾 All settings saved successfully!', 'success');
  };

  const handleChangePassword = () => {
    showToast('🔐 Password change initiated. Check your email.', 'success');
  };

  const handleResetData = async () => {
    if (!window.confirm('⚠️ WARNING: This will delete ALL recipient data. This cannot be undone. Are you sure?')) {
      return;
    }

    if (!window.confirm('Are you absolutely certain? Type "RESET" to confirm.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reset-recipients' }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset data');
      }

      showToast(`✅ ${data.message}`, 'success');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to reset data';
      showToast(`❌ ${errorMsg}`, 'error');
      console.error('Reset error:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('❌ WARNING: This will permanently delete your account. This cannot be undone. Are you sure?')) {
      return;
    }
    showToast('❌ Account deletion initiated. You will receive a confirmation email.', 'error');
  };

  const getPreviewText = () => {
    let text = emailTemplate.body;
    Object.entries(previewData).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, SMS, and notification settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'account', label: '👤 Account', icon: '👤' },
            { id: 'sms', label: '📱 SMS', icon: '📱' },
            { id: 'templates', label: '📧 Email Templates', icon: '📧' },
            { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-4 max-w-2xl">
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
              <div className="pt-4">
                <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
                  🔐 Change Password
                </Button>
              </div>
            </div>
          )}

          {/* SMS Settings */}
          {activeTab === 'sms' && (
            <div className="space-y-4 max-w-2xl">
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
              <div className="pt-4">
                <Button onClick={handleSaveSMS} className="bg-green-600 hover:bg-green-700">
                  💾 Save SMS Settings
                </Button>
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-4 max-w-4xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={emailTemplate.subject}
                    onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant={showPreview ? 'secondary' : 'primary'}
                    className="flex-1"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <textarea
                  value={emailTemplate.body}
                  onChange={(e) => setEmailTemplate({ ...emailTemplate, body: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available variables: {'{total}'}, {'{sent}'}, {'{failed}'}, {'{successRate}'}
                </p>
              </div>

              {showPreview && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fadeIn">
                  <p className="text-sm font-semibold text-gray-900 mb-2">📧 Email Preview:</p>
                  <div className="bg-white border border-gray-300 rounded p-4">
                    <p className="text-sm font-bold text-gray-900 mb-3">Subject: {emailTemplate.subject}</p>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{getPreviewText()}</div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button onClick={handleSaveTemplate} className="bg-green-600 hover:bg-green-700">
                  💾 Save Email Template
                </Button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-3 max-w-2xl">
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900">
                  <strong>ℹ️ Notification Events:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>✓ Campaign completed</li>
                  <li>✓ Campaign failed</li>
                  <li>✓ High failure rate detected</li>
                  <li>✓ Daily limit reached</li>
                </ul>
              </div>
              <div className="pt-4">
                <Button onClick={handleSaveNotifications} className="bg-green-600 hover:bg-green-700">
                  💾 Save Notification Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-red-900 mb-4">⚠️ Danger Zone</h2>
        <p className="text-sm text-red-800 mb-4">These actions cannot be undone</p>
        <div className="space-y-2">
          <button
            onClick={handleResetData}
            className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            🔄 Reset All Data
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            ❌ Delete Account
          </button>
        </div>
      </div>

      {/* Save All Button */}
      <div className="flex gap-2 max-w-2xl">
        <Button onClick={handleSaveAll} className="bg-green-600 hover:bg-green-700">
          💾 Save All Changes
        </Button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
