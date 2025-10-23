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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Description:</strong> {selectedTemplate.description}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Variables:</strong> {selectedTemplate.variables.join(', ')}
            </p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              {showDetails ? 'Hide' : 'Show'} Template Preview & Guidelines
            </button>
          </div>

          {showDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Template Preview:</p>
                <div className="bg-white p-3 rounded border border-gray-300 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedTemplate.template}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Guidelines:</p>
                <div className="bg-white p-3 rounded border border-gray-300 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedTemplate.guidelines}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
