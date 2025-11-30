
import React, { useState } from 'react';
import AiAssistant from './AiAssistant';
import ContentGenerator from './ContentGenerator';
import PhotoAnalysis from './PhotoAnalysis';
import { Bot, Sparkles, Camera, ArrowLeft, LayoutGrid } from 'lucide-react';

const AiHub = () => {
  const [activeTool, setActiveTool] = useState<'menu' | 'chat' | 'content' | 'photo'>('menu');

  return (
    <div className="animate-fade-in h-full flex flex-col">
      {activeTool === 'menu' ? (
        <div className="space-y-8 py-4">
           <div className="text-center space-y-2 pt-4">
             <h2 className="text-3xl font-light dark:text-stone-100">Estúdio IA</h2>
             <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
               Ferramentas inteligentes pra facilitar sua vida.
             </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
              <Card 
                icon={Bot} 
                color="gold" 
                title="Falar com a Zuri" 
                desc="Sua assistente virtual. Tira dúvidas, pede conselhos e bate um papo sobre o corre." 
                onClick={() => setActiveTool('chat')}
              />
              <Card 
                icon={Sparkles} 
                color="purple" 
                title="Criador de Conteúdo" 
                desc="Gere legendas criativas, biografias e ideias de posts pra bombar no Instagram." 
                onClick={() => setActiveTool('content')}
              />
              <Card 
                icon={Camera} 
                color="emerald" 
                title="Análise de Fotos" 
                desc="A Zuri analisa suas fotos e dá dicas de luz e ângulo pra valorizar o cabelo." 
                onClick={() => setActiveTool('photo')}
              />
           </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
           <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setActiveTool('menu')}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-400">
                 <LayoutGrid size={16} />
                 <span className="cursor-pointer hover:text-stone-600 dark:hover:text-stone-200" onClick={() => setActiveTool('menu')}>Menu IA</span>
                 <span>/</span>
                 <span className="text-gold-500 uppercase tracking-wider text-xs">
                   {activeTool === 'chat' && 'Zuri (Assistente)'}
                   {activeTool === 'content' && 'Conteúdo'}
                   {activeTool === 'photo' && 'Fotos'}
                 </span>
              </div>
           </div>
           
           <div className="flex-1 animate-fade-in">
             {activeTool === 'chat' && <AiAssistant embedded />}
             {activeTool === 'content' && <ContentGenerator />}
             {activeTool === 'photo' && <PhotoAnalysis />}
           </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ icon: Icon, color, title, desc, onClick }: any) => {
  const colors: any = {
    gold: 'bg-gold-100 text-gold-600 dark:bg-gold-900/20 dark:text-gold-400 group-hover:border-gold-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 group-hover:border-purple-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 group-hover:border-emerald-400',
  };

  return (
    <button 
      onClick={onClick}
      className={`bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 text-left transition-all hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colors[color].split(' group')[0]}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-medium text-stone-800 dark:text-stone-100 mb-3">{title}</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{desc}</p>
      
      <div className={`absolute inset-0 border-2 border-transparent rounded-3xl transition-colors pointer-events-none ${colors[color].split(' ').pop()}`}></div>
    </button>
  );
};

export default AiHub;
