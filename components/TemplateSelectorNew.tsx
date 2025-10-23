'use client';

import React, { useState } from 'react';
import { MESSAGE_TEMPLATES } from '@/lib/message-templates';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplateId, onTemplateChange }: TemplateSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const selectedTemplate = MESSAGE_TEMPLATES.find((t) => t.id === selectedTemplateId);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <span className="text-green-600">📝</span> Message Template
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Template:
        </label>
        <select
          value={selectedTemplateId}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          {MESSAGE_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-700 mb-2">
              <strong>📋 Description:</strong> {selectedTemplate.description}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              <strong>🔤 Variables:</strong> {selectedTemplate.variables.join(', ')}
            </p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 transition-colors"
            >
              {showDetails ? '▼ Hide' : '▶ Show'} Template Preview & Guidelines
            </button>
          </div>

          {showDetails && (
            <div className="space-y-4 mt-4">
              {/* Template Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">📄 Template Preview:</p>
                <div className="bg-white p-4 rounded border border-blue-300 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono text-xs leading-relaxed">
                  {selectedTemplate.template}
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">✅ Guidelines:</p>
                <div className="bg-white p-4 rounded border border-amber-300 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono text-xs leading-relaxed">
                  {selectedTemplate.guidelines}
                </div>
              </div>

              {/* Template Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-900 mb-2">ℹ️ Template Info:</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{selectedTemplate.id}</code>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Character Count:</strong> {selectedTemplate.template.length} characters
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>SMS Count:</strong> {Math.ceil(selectedTemplate.template.length / 160)} SMS
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
