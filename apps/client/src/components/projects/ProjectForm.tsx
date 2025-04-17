import React, { useState } from 'react';
import { CreateProjectInput } from '../../services/mock-project-service';
import { useTheme } from '../../lib/theme';

interface ProjectFormProps {
  onSubmit: (project: CreateProjectInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const LANGUAGE_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Other'
];

export function ProjectForm({ onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const { mode } = useTheme();
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    description: '',
    language: 'JavaScript',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (mode) {
      case 'light':
        return {
          text: 'text-gray-800',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          inputText: 'text-gray-800',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            tag: 'bg-blue-100 text-blue-800',
            tagButton: 'text-blue-500 hover:text-blue-700',
            addTag: 'bg-blue-500 hover:bg-blue-600 text-white'
          },
          error: 'text-red-500'
        };
      case 'dark':
        return {
          text: 'text-gray-200',
          label: 'text-gray-300',
          input: 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500',
          inputText: 'text-gray-200',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'border border-gray-600 text-gray-300 hover:bg-gray-700',
            tag: 'bg-blue-900 text-blue-300',
            tagButton: 'text-blue-400 hover:text-blue-200',
            addTag: 'bg-blue-600 hover:bg-blue-700 text-white'
          },
          error: 'text-red-400'
        };
      case 'terminal':
        return {
          text: 'text-green-400',
          label: 'text-green-500 font-mono',
          input: 'bg-black border-green-700 focus:border-green-500 focus:ring-green-500 font-mono',
          inputText: 'text-green-400',
          button: {
            primary: 'bg-green-800 hover:bg-green-700 text-green-100 font-mono',
            secondary: 'border border-green-700 text-green-400 hover:bg-green-900 font-mono',
            tag: 'bg-green-900 text-green-400 font-mono',
            tagButton: 'text-green-500 hover:text-green-300',
            addTag: 'bg-green-800 hover:bg-green-700 text-green-100 font-mono'
          },
          error: 'text-red-500 font-mono'
        };
      default:
        return {
          text: 'text-gray-800',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          inputText: 'text-gray-800',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
            tag: 'bg-blue-100 text-blue-800',
            tagButton: 'text-blue-500 hover:text-blue-700',
            addTag: 'bg-blue-500 hover:bg-blue-600 text-white'
          },
          error: 'text-red-500'
        };
    }
  };

  const styles = getThemeStyles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;

    // Don't add duplicate tags
    if (formData.tags?.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add any remaining tag
    if (tagInput.trim()) {
      formData.tags = [...(formData.tags || []), tagInput.trim()];
      setTagInput('');
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${styles.text}`}>
      <div>
        <label htmlFor="name" className={`block text-sm font-medium mb-1 ${styles.label}`}>
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${styles.input} ${styles.inputText} ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Enter project name"
          disabled={isSubmitting}
        />
        {errors.name && <p className={`mt-1 text-sm ${styles.error}`}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className={`block text-sm font-medium mb-1 ${styles.label}`}>
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md ${styles.input} ${styles.inputText} ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Enter project description"
          disabled={isSubmitting}
        />
        {errors.description && <p className={`mt-1 text-sm ${styles.error}`}>{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="language" className={`block text-sm font-medium mb-1 ${styles.label}`}>
          Primary Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${styles.input} ${styles.inputText}`}
          disabled={isSubmitting}
        >
          {LANGUAGE_OPTIONS.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className={`block text-sm font-medium mb-1 ${styles.label}`}>
          Tags
        </label>
        <div className="flex">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className={`flex-1 px-3 py-2 border rounded-l-md ${styles.input} ${styles.inputText}`}
            placeholder="Add tags (press Enter)"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={addTag}
            className={`px-3 py-2 rounded-r-md ${styles.button.addTag}`}
            disabled={isSubmitting || !tagInput.trim()}
          >
            Add
          </button>
        </div>

        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles.button.tag}`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className={`ml-1 ${styles.button.tagButton}`}
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md ${styles.button.secondary}`}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md ${styles.button.primary} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
