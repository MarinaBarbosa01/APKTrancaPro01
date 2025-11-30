
import React, { useState } from 'react';
import { analyzeImage } from '../services/gemini';
import { Camera, Upload, Image as ImageIcon, Lock, ChevronDown, Clock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_BRAID_CATALOG } from '../types';

const PhotoAnalysis = () => {
  const { checkAiLimit, incrementAiUsage, user } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New State for Braid Type Selection
  const [selectedBraidType, setSelectedBraidType] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    if (!selectedBraidType) {
        alert("Por favor, selecione qual é o modelo da trança na foto.");
        return;
    }

    if (!checkAiLimit()) {
      alert("Você atingiu o limite de uso do plano Gratuito por agora. Volte mais tarde ou seja Premium!");
      return;
    }

    setLoading(true);
    
    const base64Data = image.split(',')[1];
    
    // Enhanced Prompt based on user request for "honest review"
    const prompt = `Atue como uma instrutora especialista técnica em tranças afro.
    Analise esta foto de um trabalho de: ${selectedBraidType}.
    
    Critérios de Avaliação (Seja honesta, técnica e construtiva):
    1. Divisões (Parting): Estão limpas? Geométricas?
    2. Tensão: Parece apertado demais ou frouxo?
    3. Acabamento: O frizz foi controlado? O baby hair está harmônico?
    4. Fotografia: A luz valoriza? O ângulo está bom para portfólio?
    
    Dê uma nota de 0 a 10 para a execução e liste 3 pontos específicos de melhoria. Não seja genérica.
    `;
    
    const result = await analyzeImage(base64Data, prompt);
    setAnalysis(result);
    incrementAiUsage();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-light dark:text-stone-100">Análise Técnica</h2>
            <p className="text-stone-500 dark:text-stone-400">Avaliação profissional da sua técnica e fotografia.</p>
         </div>
         {user?.plan === 'free' && (
           <div className="text-xs bg-stone-100 dark:bg-stone-700 px-3 py-1 rounded-full text-stone-500 border border-stone-200 dark:border-stone-600">
             Modo: <span className="font-bold text-stone-800 dark:text-white">Tempo Limitado</span>
           </div>
         )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
           {/* Image Upload Area */}
           <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-2xl h-64 flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-800 relative overflow-hidden group hover:border-gold-400 transition-colors">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 pointer-events-none">
                   <div className="w-12 h-12 bg-white dark:bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-3 text-gold-500 shadow-sm">
                      <Upload size={20} />
                   </div>
                   <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Toque para enviar foto</p>
                   <p className="text-xs text-stone-400 mt-1">PNG ou JPG</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {image && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setImage(null); setAnalysis(''); }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                  >
                      <Lock size={14} />
                  </button>
              )}
           </div>
           
           {/* Braid Type Selector */}
           <div className="bg-white dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Qual técnica está na foto?</label>
              <div className="relative">
                 <select 
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 outline-none focus:ring-2 focus:ring-gold-500 appearance-none text-stone-800 dark:text-stone-100"
                    value={selectedBraidType}
                    onChange={(e) => setSelectedBraidType(e.target.value)}
                 >
                    <option value="">Selecione a técnica...</option>
                    {DEFAULT_BRAID_CATALOG.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    <option value="Outro">Outra Técnica</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-3.5 text-stone-400 pointer-events-none" size={16}/>
              </div>
           </div>
           
           <button 
             onClick={handleAnalyze}
             disabled={!image || !selectedBraidType || loading}
             className="w-full bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 py-3.5 rounded-xl font-bold disabled:opacity-50 transition-all hover:shadow-lg flex items-center justify-center gap-2"
           >
             {loading ? (
                 <>Analisando detalhes...</>
             ) : (
                 <><Camera size={18} /> Fazer Análise Profissional</>
             )}
           </button>
        </div>

        {/* Result Area */}
        <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm min-h-[400px] flex flex-col">
           <h3 className="font-bold text-lg mb-4 text-stone-800 dark:text-stone-100 border-b border-stone-100 dark:border-stone-700 pb-2">
               Relatório da Zuri
           </h3>
           
           {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse">
                <Clock size={40} className="text-gold-500 mb-4 animate-spin-slow" />
                <h4 className="text-lg font-bold text-stone-700 dark:text-stone-300">Aguarde, analisando...</h4>
                <p className="text-stone-400 text-sm mt-2 max-w-xs">
                    Estou verificando técnica, acabamento e iluminação. Isso pode levar de 1 a 2 minutos.
                </p>
             </div>
           ) : !analysis ? (
             <div className="flex-1 flex flex-col items-center justify-center text-stone-400 opacity-60">
                <ImageIcon size={48} className="mb-4 text-stone-200 dark:text-stone-600" />
                <p className="text-center text-sm px-8">
                    Selecione a técnica, envie a foto e aguarde a avaliação detalhada.
                </p>
             </div>
           ) : (
             <div className="prose prose-stone dark:prose-invert max-w-none text-sm animate-fade-in custom-scrollbar overflow-y-auto pr-2">
                <div className="bg-gold-50 dark:bg-gold-900/10 p-4 rounded-xl border border-gold-100 dark:border-gold-500/20 mb-4">
                    <p className="text-gold-700 dark:text-gold-400 font-medium text-center italic">
                        "Análise baseada em padrões de excelência para {selectedBraidType}."
                    </p>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-stone-700 dark:text-stone-300">
                  {analysis}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalysis;
