'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';
import { Toast, useToast } from '@/components/Toast';
import { TemplateSelector } from '@/components/TemplateSelectorNew';
import { Navbar } from '@/components/Navbar';
import { ContactsPage } from '@/components/pages/ContactsPageReal';
import { CampaignPage } from '@/components/pages/CampaignPageReal';
import { SettingsPage } from '@/components/pages/SettingsPageEnhanced';

interface Batch {
  batchId: string;
  totalRecords: number;
  pending: number;
  sent: number;
  failed: number;
  createdAt: string;
}

interface Recipient {
  id: number;
  phoneNumber: string;
  name: string;
  price: number;
  itemType: string;
  status: string;
  sentAt: string | null;
  batchId: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blasting, setBlasting] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contacts' | 'campaign' | 'settings'>('dashboard');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBatches();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (selectedBatch && token) {
      fetchRecipients();
    }
  }, [selectedBatch, statusFilter, page, token]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/batches', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch batches');

      const data = await response.json();
      setBatches(data.batches);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to fetch batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        batchId: selectedBatch || '',
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/recipients?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch recipients');

      const data = await response.json();
      setRecipients(data.recipients);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to fetch recipients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      showToast(
        `Uploaded ${data.recordsAdded} records (${data.recordsSkipped} skipped)`,
        'success'
      );
      fetchBatches();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleBlastSend = async () => {
    if (!selectedBatch) {
      showToast('Please select a batch first', 'error');
      return;
    }

    try {
      setBlasting(true);
      const response = await fetch('/api/blast-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ batchId: selectedBatch, templateId: selectedTemplate }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Blast failed');
      }

      const data = await response.json();
      showToast(
        `Sent: ${data.sentCount}, Failed: ${data.failedCount}`,
        'success'
      );
      fetchBatches();
      fetchRecipients();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Blast failed', 'error');
    } finally {
      setBlasting(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalStats = batches.reduce(
    (acc, batch) => ({
      total: acc.total + batch.totalRecords,
      sent: acc.sent + batch.sent,
      pending: acc.pending + batch.pending,
      failed: acc.failed + batch.failed,
    }),
    { total: 0, sent: 0, pending: 0, failed: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
              <p className="text-sm text-blue-900">
                Your daily message limit is 500. Please increase by 50 per day
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Edit limit
              </button>
            </div>

            {/* Stats Cards */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-medium opacity-90">Total Delivered</p>
                  <p className="text-3xl font-bold mt-2">{totalStats.total}</p>
                  <p className="text-xs opacity-75 mt-2">📈 Increased compared to last week</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600">Total Sent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.sent}</p>
                  <p className="text-xs text-gray-500 mt-2">📈 Increased compared to last week</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.pending}</p>
                  <p className="text-xs text-gray-500 mt-2">Waiting to be sent</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.failed}</p>
                  <p className="text-xs text-gray-500 mt-2">Requires attention</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Upload & Batches */}
              <div className="lg:col-span-1 space-y-4">
                {/* Upload Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">📤 Upload CSV/XLSX</h3>
                  <label className="block">
                    <span className="sr-only">Choose file</span>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </label>
                  {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
                </div>

                {/* Batches Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">📦 Batches</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {batches.length === 0 ? (
                      <p className="text-sm text-gray-500">No batches yet</p>
                    ) : (
                      batches.map((batch) => (
                        <button
                          key={batch.batchId}
                          onClick={() => {
                            setSelectedBatch(batch.batchId);
                            setPage(1);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                            selectedBatch === batch.batchId
                              ? 'bg-green-100 border-2 border-green-600'
                              : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <p className="font-medium">{batch.batchId}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            ✅ {batch.sent} | ⏳ {batch.pending} | ❌ {batch.failed}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Send Button */}
                {selectedBatch && (
                  <Button
                    onClick={handleBlastSend}
                    loading={blasting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  >
                    🚀 Send SMS Blast
                  </Button>
                )}
              </div>

              {/* Right Content - Recipients Table (Large) */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200 space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">👥 Recipients</h2>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="SENT">Sent</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </div>

                  {loading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-600">Loading...</div>
                  ) : recipients.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-600">
                      {selectedBatch ? 'No recipients found' : 'Select a batch to view recipients'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs">Phone</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs">Item</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs">Price</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {recipients.map((recipient) => (
                            <tr key={recipient.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900 text-sm">{recipient.name}</td>
                              <td className="px-4 py-3 text-gray-600 text-sm">{recipient.phoneNumber}</td>
                              <td className="px-4 py-3 text-gray-600 text-sm">{recipient.itemType}</td>
                              <td className="px-4 py-3 text-gray-600 text-sm">₱{recipient.price.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    recipient.status === 'SENT'
                                      ? 'bg-green-100 text-green-800'
                                      : recipient.status === 'FAILED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {recipient.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Template Section - Below Recipients */}
            <div className="mt-8">
              <TemplateSelector
                selectedTemplateId={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>
          </div>
        )}

        {activeTab === 'contacts' && token && <ContactsPage token={token} />}

        {activeTab === 'campaign' && token && <CampaignPage token={token} />}

        {activeTab === 'settings' && token && <SettingsPage token={token} />}
      </main>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
