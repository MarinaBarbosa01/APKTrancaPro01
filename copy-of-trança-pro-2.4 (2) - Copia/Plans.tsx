import React from 'react';
import { Check, X, Star, Crown } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const { user, upgradePlan } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!user) {
      navigate('/settings'); // Login redirect
      return;
    }
    upgradePlan();
    navigate('/'); // Go back home after upgrade
  };

  const isPremium = user?.plan === 'premium';

  return (
    <div className="space-y-8 py-8 animate-fade-in">
       <div className="text-center space-y-2">
         <h2 className="text-3xl font-light dark:text-stone-100">Planos & Preços</h2>
         <p className="text-stone-500 dark:text-stone-400">Escolha a melhor ferramenta para o seu crescimento</p>
       </div>

       <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          {/* Free Plan */}
          <div className={`bg-white dark:bg-stone-800 p-8 rounded-3xl border ${!isPremium ? 'border-gold-500 ring-1 ring-gold-500' : 'border-stone-200 dark:border-stone-700'} shadow-sm flex flex-col relative`}>
             {!isPremium && <div className="absolute top-0 right-0 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">ATUAL</div>}
             <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">TrançaPro Free</h3>
             <div className="text-3xl font-light mt-2 mb-6 dark:text-stone-200">Gratuito<span className="text-sm text-stone-400">/sempre</span></div>
             
             <ul className="space-y-4 mb-8 flex-1 text-sm text-stone-600 dark:text-stone-400">
                <li className="flex gap-2"><Check size={18} className="text-green-500 shrink-0"/> Agenda Básica (Manual)</li>
                <li className="flex gap-2"><Check size={18} className="text-green-500 shrink-0"/> Perfil Simples</li>
                <li className="flex gap-2"><Check size={18} className="text-green-500 shrink-0"/> Banco de Preços (Visualização)</li>
                <li className="flex gap-2"><Check size={18} className="text-green-500 shrink-0"/> Financeiro Básico (Soma)</li>
                <li className="flex gap-2"><Check size={18} className="text-green-500 shrink-0"/> IA Limitada (5/mês)</li>
                <li className="flex gap-2 text-stone-400 opacity-60"><X size={18} className="shrink-0"/> Sincronização Google Agenda</li>
                <li className="flex gap-2 text-stone-400 opacity-60"><X size={18} className="shrink-0"/> Gráficos Financeiros</li>
                <li className="flex gap-2 text-stone-400 opacity-60"><X size={18} className="shrink-0"/> Site Portfólio</li>
             </ul>

             <button disabled={true} className="w-full py-3 rounded-xl border-2 border-stone-200 dark:border-stone-600 text-stone-400 font-medium cursor-default">
               Plano Atual
             </button>
          </div>

          {/* Premium Plan */}
          <div className={`bg-stone-900 dark:bg-stone-700 p-8 rounded-3xl border ${isPremium ? 'border-green-500 ring-1 ring-green-500' : 'border-gold-500/30'} shadow-xl flex flex-col relative overflow-hidden transform hover:-translate-y-1 transition-all`}>
             {!isPremium && <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMENDADO</div>}
             {isPremium && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ATIVO</div>}
             
             <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">TrançaPro Premium</h3>
                <Crown size={20} className="text-gold-400" />
             </div>
             
             <div className="text-3xl font-light mt-2 mb-6 text-gold-400">R$ 14,99<span className="text-sm text-stone-400">/mês</span></div>
             
             <ul className="space-y-4 mb-8 flex-1 text-sm text-stone-300">
                <li className="flex gap-2"><Star size={16} className="text-gold-400 shrink-0"/> <strong>Agenda Inteligente + Google Sync</strong></li>
                <li className="flex gap-2"><Star size={16} className="text-gold-400 shrink-0"/> <strong>IA Ilimitada & Alta Precisão</strong></li>
                <li className="flex gap-2"><Star size={16} className="text-gold-400 shrink-0"/> <strong>Painel Financeiro Completo</strong></li>
                <li className="flex gap-2"><Check size={18} className="text-gold-400 shrink-0"/> Precificação com Margem de Lucro</li>
                <li className="flex gap-2"><Check size={18} className="text-gold-400 shrink-0"/> Página de Portfólio + QR Code</li>
                <li className="flex gap-2"><Check size={18} className="text-gold-400 shrink-0"/> Gestão de Clientes (CRM)</li>
                <li className="flex gap-2"><Check size={18} className="text-gold-400 shrink-0"/> Sincronização Multi-dispositivos</li>
                <li className="flex gap-2"><Check size={18} className="text-gold-400 shrink-0"/> Suporte Prioritário</li>
             </ul>

             {isPremium ? (
                 <button className="w-full py-3 rounded-xl bg-green-600 text-white font-bold cursor-default flex items-center justify-center gap-2">
                   <Check size={20}/> Você já é Premium
                 </button>
             ) : (
                 <button 
                    onClick={handleSubscribe}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 to-amber-600 text-white font-bold hover:shadow-lg transition-shadow animate-pulse"
                 >
                   Assinar Agora
                 </button>
             )}
             <p className="text-[10px] text-stone-400 text-center mt-3">Cancelamento a qualquer momento.</p>
          </div>
       </div>
    </div>
  );
};

export default Plans;