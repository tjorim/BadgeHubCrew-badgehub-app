import React, { useState } from "react";
import { ProjectEditFormData } from "@pages/AppEditPage/ProjectEditFormData.ts";
import GitLink from "@sharedComponents/GitLink.tsx";
import MarkdownText from "@sharedComponents/MarkdownText.tsx";

/**
 * A component for editing the basic information of an application.
 * It includes fields for the app's name, author, description, Git URL,
 * and a toggle to control its visibility in public listings.
 */
const AppEditBasicInfo: React.FC<{
  form: ProjectEditFormData;
  onChange: (changes: Partial<ProjectEditFormData>) => void;
}> = ({ form, onChange }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">
        Basic Information
      </h2>
      <div className="space-y-6">
        {/* App Name and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="appName"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              App Name
            </label>
            <input
              type="text"
              id="appName"
              className="w-full form-input p-2 bg-gray-700 border-gray-600 rounded-md text-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
              value={form.name || ""}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              className="w-full form-input p-2 bg-gray-700 border-gray-600 rounded-md text-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
              value={form.author || ""}
              onChange={(e) => onChange({ author: e.target.value })}
            />
          </div>
        </div>

        {/* Git URL */}
        <div>
          <label
            htmlFor="gitUrl"
            className="block text-sm font-medium text-slate-300 mb-1 flex items-center"
          >
            Git URL
            <GitLink url={form.git_url} />
          </label>
          <input
            type="url"
            id="gitUrl"
            placeholder="https://github.com/user/repo"
            className="w-full form-input p-2 bg-gray-700 border-gray-600 rounded-md text-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
            value={form.git_url || ""}
            onChange={(e) => onChange({ git_url: e.target.value })}
          />
        </div>

        {/* Description with Markdown Preview */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <span className="text-xs text-slate-500">Markdown supported</span>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-600 mb-2">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'write'
                  ? 'text-emerald-400 border-emerald-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'text-emerald-400 border-emerald-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Content */}
          {activeTab === 'write' ? (
            <textarea
              id="description"
              rows={6}
              className="w-full form-input p-3 bg-gray-700 border-gray-600 rounded-md text-slate-200 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="Enter your app description here. You can use markdown formatting:

**Bold text** or *italic text*
- Bullet points
- Links: [text](url)
- Code: `inline code`"
              value={form.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          ) : (
            <div className="min-h-[144px] p-3 bg-gray-700 border border-gray-600 rounded-md">
              {form.description ? (
                <MarkdownText className="prose prose-sm prose-invert max-w-none text-slate-300">
                  {form.description}
                </MarkdownText>
              ) : (
                <p className="text-slate-500 italic">No description provided. Switch to the Write tab to add one.</p>
              )}
            </div>
          )}
        </div>

        {/* Hidden Toggle */}
        <div className="flex items-center">
          <label htmlFor="hidden" className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="hidden"
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
              checked={!!form.hidden}
              onChange={(e) => onChange({ hidden: e.target.checked })}
            />
            <span className="ml-2 text-sm font-medium text-slate-300">
              Hidden
            </span>
          </label>
          <p className="ml-4 text-xs text-slate-500">
            If checked, this app will not appear in public listings.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AppEditBasicInfo;
