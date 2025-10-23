'use client';

import React, { useState } from 'react';

interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  sent: number;
  delivered: number;
  failed: number;
  createdAt: string;
  progress: number;
}

export function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: 'October Delivery Fees',
      status: 'active',
      sent: 450,
      delivered: 425,
      failed: 25,
      createdAt: '2025-10-23',
      progress: 85,
    },
    {
      id: 2,
      name: 'September Batch',
      status: 'completed',
      sent: 200,
      delivered: 198,
      failed: 2,
      createdAt: '2025-09-15',
      progress: 100,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Track and manage your SMS campaigns</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + New Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Campaigns</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{campaigns.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {campaigns.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Sent</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {campaigns.reduce((sum, c) => sum + c.sent, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Total Delivered</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {campaigns.reduce((sum, c) => sum + c.delivered, 0)}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Created on {campaign.createdAt}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  campaign.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {campaign.status === 'active'
                  ? '🔴 Active'
                  : campaign.status === 'paused'
                  ? '⏸️ Paused'
                  : '✓ Completed'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Progress</p>
                <p className="text-sm font-semibold text-gray-900">{campaign.progress}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600">Sent</p>
                <p className="text-lg font-bold text-gray-900">{campaign.sent}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Delivered</p>
                <p className="text-lg font-bold text-green-600">{campaign.delivered}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Failed</p>
                <p className="text-lg font-bold text-red-600">{campaign.failed}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Success Rate</p>
                <p className="text-lg font-bold text-gray-900">
                  {Math.round((campaign.delivered / campaign.sent) * 100)}%
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {campaign.status === 'active' && (
                <>
                  <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
                    Pause
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                    Stop
                  </button>
                </>
              )}
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
