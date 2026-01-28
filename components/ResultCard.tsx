
import React, { useState } from 'react';
import { GenerationResult } from '../types';
import { Button } from './Button';

interface ResultCardProps {
  result: GenerationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  const copyToClipboard = (text: string, type: 'title' | 'desc') => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Conteúdo Gerado
      </h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Título Otimizado</span>
            <button 
              onClick={() => copyToClipboard(result.title, 'title')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copiedTitle ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-lg font-medium text-slate-800">
            {result.title}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Descrição Profissional</span>
            <button 
              onClick={() => copyToClipboard(result.description, 'desc')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copiedDesc ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-700 leading-relaxed">
            {result.description}
          </div>
        </div>
      </div>
    </div>
  );
};
