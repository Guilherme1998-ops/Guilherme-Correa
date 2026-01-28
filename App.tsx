
import React, { useState, useRef } from 'react';
import { Marketplace, ProductData, GenerationResult, ImageData, ImageGenerationResult } from './types';
import { generateCopy, generateProductImage, analyzeProductImage } from './services/geminiService';
import { Input, TextArea } from './components/Input';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { ImageResultCard } from './components/ImageResultCard';
import { AnalysisResultCard } from './components/AnalysisResultCard';

const App: React.FC = () => {
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [imageResult, setImageResult] = useState<ImageGenerationResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'copy' | 'image' | 'analysis'>('copy');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analysisFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductData>({
    marketplace: Marketplace.MERCADO_LIVRE,
    productName: '',
    category: '',
    subcategory: '',
    technicalSpecs: '',
    indicatedUse: '',
    differentials: '',
    additionalObservations: ''
  });

  const [imageData, setImageData] = useState<ImageData>({
    visualDescription: '',
    category: '',
    scenario: 'Estúdio profissional minimalista com iluminação premium',
    sourceImage: undefined
  });

  const [analysisImage, setAnalysisImage] = useState<string | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setImageData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'analysis') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'image') {
          setImageData(prev => ({ ...prev, sourceImage: reader.result as string }));
        } else {
          setAnalysisImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = (target: 'image' | 'analysis') => {
    if (target === 'image') {
      setImageData(prev => ({ ...prev, sourceImage: undefined }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setAnalysisImage(undefined);
      if (analysisFileInputRef.current) analysisFileInputRef.current.value = '';
    }
  };

  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName) return;
    setLoadingCopy(true);
    try {
      const copy = await generateCopy(formData);
      setResult(copy);
    } catch (error) {
      alert("Houve um erro ao gerar a descrição. Tente novamente.");
    } finally {
      setLoadingCopy(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageData.visualDescription && !imageData.sourceImage) {
      alert("Por favor, forneça uma descrição visual ou carregue uma imagem.");
      return;
    }
    setLoadingImage(true);
    try {
      const img = await generateProductImage(imageData);
      setImageResult(img);
    } catch (error) {
      alert("Houve um erro ao gerar a imagem. Tente novamente.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisImage) return;
    setLoadingAnalysis(true);
    try {
      const text = await analyzeProductImage(analysisImage);
      setAnalysisResult(text);
    } catch (error) {
      alert("Houve um erro ao analisar a imagem.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">CopyPro <span className="text-blue-600">Studio</span></h1>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
            <button 
              onClick={() => setActiveTab('copy')}
              className={`px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'copy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Copywriting
            </button>
            <button 
              onClick={() => setActiveTab('image')}
              className={`px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Imagens
            </button>
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'analysis' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Análise Visual
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          {activeTab === 'copy' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Gerador de Texto SEO
              </h2>
              <form onSubmit={handleGenerateCopy} className="space-y-5">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Marketplace Alvo</label>
                  <select name="marketplace" value={formData.marketplace} onChange={handleInputChange} className="px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white transition-all focus:ring-2 focus:ring-blue-500">
                    {Object.values(Marketplace).map(mp => <option key={mp} value={mp}>{mp}</option>)}
                  </select>
                </div>
                <Input label="Nome do Produto" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="Ex: Teclado Mecânico Gamer RGB" required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Categoria" name="category" value={formData.category} onChange={handleInputChange} placeholder="Informática" />
                  <Input label="Subcategoria" name="subcategory" value={formData.subcategory} onChange={handleInputChange} placeholder="Periféricos" />
                </div>
                <TextArea label="Ficha Técnica" name="technicalSpecs" value={formData.technicalSpecs} onChange={handleInputChange} placeholder="Switches, Conectividade, Medidas, etc." />
                <div className="grid grid-cols-2 gap-4">
                  <TextArea label="Uso Indicado" name="indicatedUse" value={formData.indicatedUse} onChange={handleInputChange} placeholder="Para quem é este produto?" />
                  <TextArea label="Diferenciais" name="differentials" value={formData.differentials} onChange={handleInputChange} placeholder="O que torna seu produto único?" />
                </div>
                <TextArea label="Observações Adicionais" name="additionalObservations" value={formData.additionalObservations} onChange={handleInputChange} placeholder="Garantia, brindes, avisos..." />
                <Button type="submit" isLoading={loadingCopy} className="w-full h-12">Gerar Descrição de Alta Conversão</Button>
              </form>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gerador de Imagens Realistas
              </h2>
              <form onSubmit={handleGenerateImage} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Foto Original do Produto (Upload para Trocar Fundo)</label>
                  {!imageData.sourceImage ? (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                      <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'image')} accept="image/*" className="hidden" />
                      <svg className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <p className="text-slate-600 font-medium">Clique para carregar foto do produto</p>
                      <p className="text-xs text-slate-400 mt-1">A IA manterá o produto e trocará 100% do cenário.</p>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      <img src={imageData.sourceImage} alt="Preview" className="w-full h-full object-contain" />
                      <button onClick={() => clearUploadedImage('image')} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <TextArea 
                    label="DNA Visual / Descrição do Produto" 
                    name="visualDescription" 
                    value={imageData.visualDescription} 
                    onChange={handleImageInputChange} 
                    placeholder="Cole aqui o DNA Visual extraído na aba de Análise para máxima fidelidade." 
                    required={!imageData.sourceImage} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Categoria" name="category" value={imageData.category} onChange={handleImageInputChange} placeholder="Ex: Calçados" />
                  <Input label="Novo Cenário" name="scenario" value={imageData.scenario} onChange={handleImageInputChange} placeholder="Ex: Estúdio profissional minimalista..." />
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-xs text-amber-800">
                  <strong>Aviso:</strong> Para trocar o fundo com sucesso, garanta que o campo "Novo Cenário" descreva um ambiente diferente do original.
                </div>
                <Button type="submit" isLoading={loadingImage} variant="secondary" className="w-full h-12">{imageData.sourceImage ? 'Substituir Cenário Agora' : 'Criar Foto do Zero'}</Button>
              </form>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Gerador de DNA Visual
              </h2>
              <p className="text-sm text-slate-500 mb-6 italic">Use esta ferramenta para extrair a descrição técnica perfeita do seu produto e usá-la na geração de fotos.</p>
              
              <form onSubmit={handleAnalyzeImage} className="space-y-6">
                <div className="space-y-2">
                  {!analysisImage ? (
                    <div onClick={() => analysisFileInputRef.current?.click()} className="border-2 border-dashed border-purple-200 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group">
                      <input type="file" ref={analysisFileInputRef} onChange={(e) => handleFileUpload(e, 'analysis')} accept="image/*" className="hidden" />
                      <svg className="w-12 h-12 text-purple-300 mx-auto mb-4 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <p className="text-slate-600 font-semibold">Carregar foto real para análise</p>
                      <p className="text-xs text-slate-400 mt-2">Extraímos materiais, cores e texturas em segundos.</p>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-slate-50 rounded-xl overflow-hidden border border-purple-100 p-4">
                      <img src={analysisImage} alt="Analysis Preview" className="w-full h-full object-contain" />
                      <button onClick={() => clearUploadedImage('analysis')} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <Button type="submit" isLoading={loadingAnalysis} className="w-full h-12 bg-purple-600 hover:bg-purple-700" disabled={!analysisImage}>Extrair DNA Visual</Button>
              </form>
            </div>
          )}
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Monitor de Operações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Texto SEO:</span>
                <span className={result ? "text-emerald-600 font-bold" : "text-slate-300"}>{result ? "Disponível ✓" : "Pendente"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Imagem Gerada:</span>
                <span className={imageResult ? "text-emerald-600 font-bold" : "text-slate-300"}>{imageResult ? "Pronta ✓" : "Pendente"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Análise de DNA:</span>
                <span className={analysisResult ? "text-purple-600 font-bold" : "text-slate-300"}>{analysisResult ? "Concluída ✓" : "Pendente"}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Dica Pro
            </h3>
            <p className="text-sm text-blue-50 leading-relaxed mb-4">
              A substituição de ambiente funciona melhor quando você usa o <strong>DNA Visual</strong> gerado na aba de análise. Ele ensina a IA os detalhes do seu produto para que ela não os mude ao trocar o fundo.
            </p>
            <div className="text-[10px] uppercase tracking-widest text-blue-200 font-bold">
              Workflow: Analisar → Copiar DNA → Gerar Imagem
            </div>
          </div>
        </div>
      </main>

      {(result || imageResult || analysisResult || loadingImage || loadingAnalysis) && (
        <div className="max-w-6xl mx-auto px-4 mt-12 grid md:grid-cols-2 gap-8 mb-10">
          {result && activeTab === 'copy' && <ResultCard result={result} />}
          {(imageResult || loadingImage) && activeTab === 'image' && <ImageResultCard imageUrl={imageResult?.imageUrl || ''} loading={loadingImage} />}
          {(analysisResult || loadingAnalysis) && activeTab === 'analysis' && (
            <div className="col-span-full">
              <AnalysisResultCard text={analysisResult || 'Processando DNA visual do seu produto...'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
