
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input 
      className={`px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <textarea 
      className={`px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y min-h-[100px] ${className}`}
      {...props}
    />
  </div>
);
