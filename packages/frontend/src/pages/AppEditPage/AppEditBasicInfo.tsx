import React from "react";
import { ProjectEditFormData } from "@pages/AppEditPage/ProjectEditFormData.ts";
import GitLink from "@sharedComponents/GitLink.tsx";
import MDEditor from '@uiw/react-md-editor';

/**
 * A component for editing the basic information of an application.
 * It includes fields for the app's name, author, description, Git URL,
 * and a toggle to control its visibility in public listings.
 */
const AppEditBasicInfo: React.FC<{
  form: ProjectEditFormData;
  onChange: (changes: Partial<ProjectEditFormData>) => void;
}> = ({ form, onChange }) => {
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

        {/* Description with Markdown Editor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <span className={`text-xs ${
              (form.description?.length || 0) > 2000 
                ? 'text-red-400' 
                : 'text-slate-500'
            }`}>
              {form.description?.length || 0}/2000
            </span>
          </div>
          <div data-color-mode="dark">
            <MDEditor
              value={form.description || ""}
              onChange={(value) => onChange({ description: value || "" })}
              visibleDragbar={false}
              textareaProps={{
                placeholder: "Enter your app description here. You can use markdown formatting like **bold**, *italic*, [links](url), `code`, and more...",
                maxLength: 2000
              }}
              height={window.innerWidth < 768 ? 200 : 300}
            />
          </div>
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
