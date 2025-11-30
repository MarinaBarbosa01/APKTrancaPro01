
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calculator, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  MapPin, 
  ScanLine, 
  Settings, 
  Crown,
  Check,
  Lock,
  Heart,
  Lightbulb,
  TrendingUp,
  Smile,
  Globe,
  Quote,
  UserPlus
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Appointment } from '../types';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [nextAppointments, setNextAppointments] = useState<Appointment[]>([]);

  // Lógica para saudação dinâmica e neutra
  const [greeting] = useState(() => {
    const hours = new Date().getHours();
    const options = ['Oi', 'Que bom te ver', 'Olá', 'E aí'];
    
    // Adiciona saudação baseada no horário
    if (hours < 12) options.push('Bom dia');
    else if (hours < 18) options.push('Boa tarde');
    else options.push('Boa noite');

    return options[Math.floor(Math.random() * options.length)];
  });

  const firstName = user?.name ? user.name.split(' ')[0] : 'Profissional';
  const isDemoUser = user?.email === 'trancista@demo.com';

  // Smart Insight Generator
  const getSmartInsight = () => {
      const style = user?.communicationStyle || 'parceira';
      
      // Different messages based on persona
      if (style === 'formal') {
          return "Lembre-se: O controle financeiro rigoroso é a base da escalabilidade. Verifique seu fluxo de caixa hoje.";
      }
      if (style === 'mentora') {
          return "Você está construindo um legado. Respire fundo, valorize seu descanso e confie no seu processo.";
      }
      // Parceira (Default)
      return "Não esquece de postar aquele story do trabalho de ontem! Quem não é visto, não é lembrado. 😉";
  };

  useEffect(() => {
    // Read appointments directly from localStorage to ensure dashboard is live
    const saved = localStorage.getItem('appointments');
    if (saved) {
      const allAppts: Appointment[] = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      
      const todayList = allAppts
        .filter(a => a.date === today)
        .sort((a, b) => a.time.localeCompare(b.time));
        
      const nextList = allAppts
        .filter(a => a.date > today)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 3); // Only show top 3 next

      setTodaysAppointments(todayList);
      setNextAppointments(nextList);
    }
  }, []); // Run once on mount

  const features = [
    { icon: Calculator, label: 'Quanto Cobrar?', path: '/pricing', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { icon: Calendar, label: 'Minha Agenda', path: '/agenda', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { 
      icon: Globe, 
      label: 'Link Agendar', 
      path: user?.publicProfile?.username ? `/schedule/${user.publicProfile.username}` : '/agenda', 
      color: 'text-pink-600 dark:text-pink-400', 
      bg: 'bg-pink-100 dark:bg-pink-900/20' 
    },
    { icon: DollarSign, label: 'Meu Dinheiro', path: '/finance', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/20' },
    { icon: Sparkles, label: 'Zuri IA', path: '/ai', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { icon: ScanLine, label: 'Scan Perfil', path: '/scan', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
    { icon: BookOpen, label: 'Aprenda', path: '/learn', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { icon: Calculator, label: 'Materiais', path: '/materials', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
    { icon: MapPin, label: 'Onde Comprar', path: '/stores', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { icon: Settings, label: 'Ajustes', path: '/settings', color: 'text-stone-600 dark:text-stone-400', bg: 'bg-stone-100 dark:bg-stone-700' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-light text-stone-900 dark:text-stone-100">
          {greeting}, <span className="font-semibold text-gold-600 dark:text-gold-400">{firstName}</span>!
        </h1>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl text-lg">
          Bora organizar esse negócio e crescer?
        </p>
      </header>

      {/* CTA Account Creation (Only for Demo Users) */}
      {isDemoUser && (
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-in">
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center text-gold-600 shrink-0">
                 <UserPlus size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-sm text-stone-800 dark:text-stone-100">Essa conta é temporária</h3>
                 <p className="text-xs text-stone-500 dark:text-stone-400">Crie seu login oficial para salvar seus dados.</p>
              </div>
           </div>
           <button 
             onClick={() => navigate('/settings')}
             className="w-full sm:w-auto bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 px-6 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg transition-all whitespace-nowrap"
           >
             Criar Conta Grátis
           </button>
        </div>
      )}
      
      {/* Zuri Smart Insight Card */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 dark:from-stone-700 dark:to-stone-800 p-6 rounded-3xl shadow-lg relative overflow-hidden flex items-start gap-4 text-white">
         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
             <Quote size={20} className="text-gold-400"/>
         </div>
         <div className="relative z-10">
             <h3 className="font-bold text-gold-400 text-xs uppercase tracking-wider mb-1">Conselho da Zuri</h3>
             <p className="font-display text-lg leading-snug opacity-95 italic">
                 "{getSmartInsight()}"
             </p>
         </div>
         <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Appointment Snapshot */}
      <div className="grid md:grid-cols-2 gap-6">
         {/* Today */}
         <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Hoje
            </h3>
            {todaysAppointments.length > 0 ? (
               <div className="space-y-3">
                  {todaysAppointments.map(appt => (
                     <div key={appt.id} className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-700/50 rounded-xl">
                        <div className="font-bold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-600 px-2 py-1 rounded shadow-sm">
                           {appt.time}
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-medium dark:text-stone-100">{appt.clientName}</p>
                           <p className="text-xs text-stone-500 dark:text-stone-400">{appt.service}</p>
                        </div>
                        {appt.origin === 'public_link' && <div className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">Online</div>}
                     </div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-6 text-stone-400 text-sm">
                  Dia livre hoje! Aproveita pra descansar ou estudar.
               </div>
            )}
         </div>

         {/* Upcoming */}
         <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-3xl border border-stone-200 dark:border-stone-700">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4">Próximos</h3>
            {nextAppointments.length > 0 ? (
               <div className="space-y-3">
                  {nextAppointments.map(appt => (
                     <div key={appt.id} className="flex items-center gap-3 opacity-80">
                         <Calendar size={14} className="text-stone-400"/>
                         <span className="text-xs font-bold text-stone-600 dark:text-stone-300 w-12">{appt.date.slice(5).replace('-','/')}</span>
                         <div className="flex-1">
                            <p className="text-sm text-stone-700 dark:text-stone-200">{appt.clientName}</p>
                         </div>
                         <span className="text-xs text-stone-500">{appt.time}</span>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-6 text-stone-400 text-sm">
                  Agenda tranquila nos próximos dias.
               </div>
            )}
            <Link to="/agenda" className="block mt-4 text-center text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline">Ver Agenda Completa</Link>
         </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {features.map((item, index) => (
          <Link 
            key={index} 
            to={item.path}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300 text-center">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Narrative Section: Introduction & Connection */}
      <div className="space-y-10 py-4">
        
        {/* Intro Card */}
        <div className="bg-stone-50 dark:bg-stone-800/50 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-700 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
           <h2 className="text-2xl font-display text-stone-800 dark:text-stone-100 mb-4">
             Mais que um app, sua parceira de bancada
           </h2>
           <p className="text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
             O <strong>Trança Pro</strong> é o primeiro assistente digital completo pensado exclusivamente pra nós, profissionais das tranças. Unimos a nossa arte com a tecnologia pra você voar.
           </p>
        </div>

        {/* Why we developed this */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
           <div>
              <div className="flex items-center gap-2 mb-3 text-gold-600 dark:text-gold-400">
                 <Heart size={20} fill="currentColor" />
                 <span className="text-sm font-bold uppercase tracking-wider">Nosso Propósito</span>
              </div>
              <h3 className="text-3xl font-display text-stone-900 dark:text-white mb-4">
                Valorizando a coroa que você constrói
              </h3>
              <div className="space-y-4 text-stone-600 dark:text-stone-300 leading-relaxed">
                <p>
                  A gente sabe que trançar é arte, mas também exige técnica, horas em pé e muita dedicação. Gerir o negócio sem ajuda não é fácil.
                </p>
                <p>
                  Fizemos o Trança Pro pra você deixar a matemática e a organização com a gente, e focar no que suas mãos sabem fazer de melhor: <strong>elevar a autoestima das suas clientes.</strong>
                </p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
                 <TrendingUp className="text-emerald-500 mb-3" size={24} />
                 <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Profissionalismo</h4>
                 <p className="text-xs text-stone-500 dark:text-stone-400">Seu negócio em outro patamar.</p>
              </div>
              <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 mt-6">
                 <Smile className="text-gold-500 mb-3" size={24} />
                 <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Tempo pra você</h4>
                 <p className="text-xs text-stone-500 dark:text-stone-400">Organiza a agenda e descansa.</p>
              </div>
              <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 -mt-6">
                 <Lightbulb className="text-purple-500 mb-3" size={24} />
                 <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Inteligência</h4>
                 <p className="text-xs text-stone-500 dark:text-stone-400">IA pra te ajudar a pensar.</p>
              </div>
              <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
                 <Check className="text-blue-500 mb-3" size={24} />
                 <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-1">Clareza</h4>
                 <p className="text-xs text-stone-500 dark:text-stone-400">Saiba quanto você lucra real.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Banner Premium */}
      {user?.plan !== 'premium' && (
        <div className="bg-gradient-to-r from-stone-800 to-stone-900 dark:from-gold-600 dark:to-amber-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
               <h3 className="font-display text-xl mb-1 flex items-center gap-2"> <Crown size={20} className="text-gold-400 dark:text-stone-900"/> Seja Premium</h3>
               <p className="text-sm text-stone-300 dark:text-stone-100">Libere a Zuri ilimitada e agenda sincronizada.</p>
            </div>
            <Link to="/plans" className="relative z-10 bg-white text-stone-900 dark:text-gold-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-100 transition-colors">
               Ver Planos
            </Link>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      )}
      
      {/* How it Works / Plans Comparison Footer */}
      <div className="pt-8 border-t border-stone-200 dark:border-stone-700">
         <h3 className="text-center text-xl font-display mb-8 dark:text-stone-100">Escolha como crescer</h3>
         
         <div className="grid md:grid-cols-2 gap-6">
            {/* Free Column */}
            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-3xl border border-stone-200 dark:border-stone-700">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center text-stone-500">
                     <span className="font-bold text-xs">FREE</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-stone-800 dark:text-stone-200">Comece Grátis</h4>
                     <p className="text-xs text-stone-500">O básico que funciona</p>
                  </div>
               </div>
               <ul className="space-y-3">
                  <li className="flex gap-2 text-sm text-stone-600 dark:text-stone-400">
                     <Check size={16} className="text-stone-400 shrink-0"/> Agenda manual
                  </li>
                  <li className="flex gap-2 text-sm text-stone-600 dark:text-stone-400">
                     <Check size={16} className="text-stone-400 shrink-0"/> Calculadora de preços simples
                  </li>
                  <li className="flex gap-2 text-sm text-stone-600 dark:text-stone-400">
                     <Check size={16} className="text-stone-400 shrink-0"/> 5 mensagens com a Zuri / mês
                  </li>
                  <li className="flex gap-2 text-stone-400 opacity-70">
                     <Lock size={16} className="shrink-0"/> Sem Google Agenda
                  </li>
               </ul>
            </div>

            {/* Premium Column */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-gold-200 dark:border-stone-600 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-full blur-xl"></div>
               <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-md">
                     <Crown size={16} />
                  </div>
                  <div>
                     <h4 className="font-bold text-stone-800 dark:text-stone-200">Plano Profissional</h4>
                     <p className="text-xs text-gold-600 dark:text-gold-400 font-medium">R$ 14,99 / mês</p>
                  </div>
               </div>
               <ul className="space-y-3 relative z-10">
                  <li className="flex gap-2 text-sm text-stone-700 dark:text-stone-300 font-medium">
                     <Check size={16} className="text-gold-500 shrink-0"/> Sincronização Google Agenda
                  </li>
                  <li className="flex gap-2 text-sm text-stone-700 dark:text-stone-300 font-medium">
                     <Check size={16} className="text-gold-500 shrink-0"/> Zuri IA Ilimitada
                  </li>
                  <li className="flex gap-2 text-sm text-stone-700 dark:text-stone-300 font-medium">
                     <Check size={16} className="text-gold-500 shrink-0"/> Relatórios Financeiros
                  </li>
                  <li className="flex gap-2 text-sm text-stone-700 dark:text-stone-300 font-medium">
                     <Check size={16} className="text-gold-500 shrink-0"/> Portfólio Digital com Fotos
                  </li>
               </ul>
               <button 
                 onClick={() => navigate('/plans')}
                 className="w-full mt-6 py-2.5 rounded-xl bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 text-sm font-bold hover:shadow-lg transition-all"
               >
                 Testar Premium
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;
