
import React, { useState } from 'react';
import { generateText } from '../services/gemini';
import { Sparkles, Copy, Check, Clock } from 'lucide-react';

const ContentGenerator = () => {
  const [type, setType] = useState('Legenda para Instagram');
  const [theme, setTheme] = useState('');
  const [details, setDetails] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!theme) return;
    setLoading(true);
    setResult(''); 
    const prompt = `Crie um conteúdo para redes sociais de uma trancista.
    Tipo: ${type}
    Tema: ${theme}
    Detalhes extras: ${details}
    
    Use uma linguagem engajadora, use emojis, hashtags relevantes para trancistas no Brasil (#trancista #boxbraids #penteados).`;
    
    const text = await generateText(prompt);
    setResult(text);
    setLoading(false);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-light dark:text-stone-100">Gerador de Conteúdo IA</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
           <div>
             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tipo de Conteúdo</label>
             <select 
               className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none"
               value={type}
               onChange={e => setType(e.target.value)}
             >
               <option>Legenda para Instagram</option>
               <option>Roteiro para Story</option>
               <option>Bio do Perfil</option>
               <option>Ideia para Reels</option>
             </select>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Sobre o que é?</label>
             <input 
               className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none"
               placeholder="Ex: Promoção de Box Braids, Agenda Aberta..."
               value={theme}
               onChange={e => setTheme(e.target.value)}
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Detalhes (Opcional)</label>
             <textarea 
               className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none"
               rows={3}
               placeholder="Ex: Promoção válida até sexta, desconto de 10%..."
               value={details}
               onChange={e => setDetails(e.target.value)}
             />
           </div>

           <button 
             onClick={handleGenerate}
             disabled={loading || !theme}
             className="w-full bg-gold-500 text-white py-3 rounded-xl font-medium hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
           >
             {loading ? 'Criando...' : <><Sparkles size={18} /> Gerar Conteúdo</>}
           </button>
        </div>

        <div className="bg-stone-50 dark:bg-stone-700/50 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 relative min-h-[300px]">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-full text-center animate-pulse">
                <Clock size={40} className="text-gold-500 mb-4 animate-spin-slow" />
                <h4 className="text-lg font-bold text-stone-700 dark:text-stone-300">Escrevendo pra você...</h4>
                <p className="text-stone-400 text-sm mt-2 max-w-xs">
                    Criando algo criativo e único. Aguarde de 1 a 2 minutos.
                </p>
             </div>
           ) : !result ? (
             <div className="flex flex-col items-center justify-center h-full text-stone-400">
               <Sparkles size={48} className="mb-4 opacity-20" />
               <p className="text-center">Seu conteúdo gerado pela IA aparecerá aqui.</p>
             </div>
           ) : (
             <div className="animate-fade-in">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-medium text-stone-700 dark:text-stone-300">Resultado:</h3>
                 <button 
                   onClick={copyToClipboard}
                   className="text-stone-500 hover:text-gold-500 transition-colors"
                   title="Copiar"
                 >
                   {copied ? <Check size={20} className="text-green-500"/> : <Copy size={20} />}
                 </button>
               </div>
               <div className="whitespace-pre-wrap text-stone-800 dark:text-stone-200 text-sm leading-relaxed">
                 {result}
               </div>
             </div>
           )}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
        <h4 className="font-semibold text-amber-800 dark:text-amber-400 text-sm mb-2">Dicas Rápidas de Marketing</h4>
        <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-1 list-disc pl-4">
          <li>Poste fotos de boa qualidade entre 18h e 21h.</li>
          <li>Responda todos os comentários na primeira hora.</li>
          <li>Use stories para mostrar os bastidores e criar conexão.</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentGenerator;
