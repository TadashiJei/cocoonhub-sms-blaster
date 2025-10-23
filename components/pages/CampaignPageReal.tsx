'use client';

import React, { useState, useEffect } from 'react';

interface Batch {
  batchId: string;
  totalRecords: number;
  pending: number;
  sent: number;
  failed: number;
  createdAt: string;
}

interface CampaignPageProps {
  token?: string;
}

export function CampaignPage({ token }: CampaignPageProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchBatches();
    }
  }, [token]);

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
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Track and manage your SMS campaigns</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Campaigns</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{batches.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Recipients</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Sent</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalStats.sent}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{totalStats.pending}</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-600">Loading campaigns...</div>
        ) : batches.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-600">No campaigns yet. Upload a CSV to create one.</div>
        ) : (
          batches.map((batch) => {
            const successRate = batch.totalRecords > 0 ? Math.round((batch.sent / batch.totalRecords) * 100) : 0;
            const status = batch.pending > 0 ? 'active' : batch.sent > 0 ? 'completed' : 'pending';

            return (
              <div key={batch.batchId} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{batch.batchId}</h3>
                    <p className="text-sm text-gray-600 mt-1">Created on {new Date(batch.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {status === 'active' ? '🔴 Active' : status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Progress</p>
                    <p className="text-sm font-semibold text-gray-900">{successRate}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-bold text-gray-900">{batch.totalRecords}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Sent</p>
                    <p className="text-lg font-bold text-green-600">{batch.sent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-yellow-600">{batch.pending}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Failed</p>
                    <p className="text-lg font-bold text-red-600">{batch.failed}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
