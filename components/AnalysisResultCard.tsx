
import React, { useState } from 'react';

interface AnalysisResultCardProps {
  text: string;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            DNA Visual Extraído
          </h2>
          <span className="text-xs text-slate-500 mt-1">Prompt otimizado para re-geração de cenário</span>
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-sm font-medium text-white transition-all bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full shadow-md active:scale-95"
        >
          {copied ? 'Copiado!' : 'Copiar para Imagens'}
        </button>
      </div>

      <div className="p-5 bg-purple-50/50 rounded-lg border border-purple-100 text-slate-700 leading-relaxed text-sm md:text-base font-medium relative">
        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm10.707 7.293a1 1 0 00-1.414 0L11 13.586 9.707 12.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" /></svg>
        </div>
        {text}
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-blue-600 shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs text-blue-700 leading-normal">
            <strong>Instrução:</strong> Copie o DNA acima, vá na aba <strong>Imagens</strong>, cole no campo "Descrição Visual" e carregue a foto original. Defina o novo cenário para ver a mágica acontecer!
          </p>
        </div>
      </div>
    </div>
  );
};
