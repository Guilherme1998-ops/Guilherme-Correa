
import React from 'react';
import { Button } from './Button';

interface ImageResultCardProps {
  imageUrl: string;
  loading: boolean;
}

export const ImageResultCard: React.FC<ImageResultCardProps> = ({ imageUrl, loading }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'produto-copypro.png';
    link.click();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 animate-pulse">
        <div className="w-full aspect-square bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-slate-400 font-medium">Gerando imagem premium...</span>
        </div>
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Imagem do Produto
      </h2>

      <div className="relative group overflow-hidden rounded-lg border border-slate-200 shadow-inner mb-6">
        <img 
          src={imageUrl} 
          alt="Produto gerado" 
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button onClick={downloadImage} variant="primary">
            Baixar Imagem
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-slate-400 text-center italic">
        Esta imagem foi gerada por IA e está pronta para uso comercial.
      </p>
    </div>
  );
};
