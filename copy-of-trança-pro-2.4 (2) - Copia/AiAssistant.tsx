
import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/gemini';
import { Send, Bot, User, Loader2, Lock, Settings, Smile, Briefcase, Heart, Clock, LogIn } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AiAssistant = ({ embedded = false }: { embedded?: boolean }) => {
  const { checkAiLimit, recordAiInteraction, getAiStatus, user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [showPersonaSettings, setShowPersonaSettings] = useState(false);
  
  // Timer State
  const [timerStatus, setTimerStatus] = useState(getAiStatus());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
       setTimerStatus(getAiStatus());
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Helper to format ms to HH:MM:SS
  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize messages based on user style and gender
  const getInitialMessage = () => {
     if (!user) return "Olá! Faça login para conversarmos.";

     const gender = user?.gender || 'Prefiro não dizer';
     let greetingNoun = "pessoa incrível";
     
     if (gender === 'Mulher Cis' || gender === 'Mulher Trans' || gender === 'Travesti') {
         greetingNoun = "maravilhosa";
     } else if (gender === 'Homem Cis' || gender === 'Homem Trans') {
         greetingNoun = "parceiro";
     } else if (gender === 'Não-Binário') {
         greetingNoun = "ícone";
     } else {
         greetingNoun = "profissional";
     }

     if (user?.communicationStyle === 'formal') {
        return `Olá. Sou a Zuri, sua assistente técnica. Como posso auxiliar na gestão do seu negócio hoje, ${user?.name?.split(' ')[0] || ''}? (Nota: Você pode ajustar meu estilo de comunicação clicando no ícone de engrenagem acima).`;
     }
     if (user?.communicationStyle === 'mentora') {
        return `Olá, ${greetingNoun}! Sou a Zuri. Estou aqui para te apoiar na sua jornada. Qual o seu desafio de hoje? (Sinta-se à vontade para ajustar como conversamos clicando na engrenagem ali em cima).`;
     }
     // Default / Parceira
     return `Oi, ${greetingNoun}! Sou a Zuri, sua parceira aqui no app. Tô pronta pra ajudar com preços, dicas de Insta ou qualquer dúvida sobre tranças. Manda aí! (Psiu: clica na engrenagem ⚙️ ali no canto pra personalizar nosso papo)`;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: getInitialMessage() }
  ]);

  // Update initial message if style/gender changes
  useEffect(() => {
     if (messages.length === 1 && messages[0].role === 'ai') {
        setMessages([{ role: 'ai', content: getInitialMessage() }]);
     }
  }, [user?.communicationStyle, user?.gender]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Safety check for auth
    if (!user) {
        navigate('/settings');
        return;
    }

    // Check limit first
    if (!checkAiLimit()) {
      // Force update timer status visually immediately
      setTimerStatus(getAiStatus());
      return;
    }

    // Record interaction atomically (Start session if needed + increment count)
    recordAiInteraction();

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // DYNAMIC SYSTEM PROMPT
    let styleInstruction = "";
    if (user?.communicationStyle === 'formal') {
        styleInstruction = "Você é uma consultora de negócios executiva. Use linguagem formal, técnica, culta e objetiva. Evite gírias. Foque em métricas, gestão e profissionalismo.";
    } else if (user?.communicationStyle === 'mentora') {
        styleInstruction = "Você é uma mentora sábia e acolhedora. Use linguagem carinhosa, inspiradora e motivacional. Foque no emocional e no crescimento pessoal.";
    } else {
        styleInstruction = "Você é a melhor amiga e parceira de trabalho. Use gírias leves (como 'mana', 'corre'), emojis e seja muito divertida e descolada. Foque em dicas práticas e rápidas.";
    }

    const genderInstruction = `O gênero da usuária é: ${user?.gender || 'Neutro/Desconhecido'}. Adapte seus pronomes e adjetivos para concordar com esse gênero. Se for neutro ou desconhecido, evite termos generificados.`;

    const prompt = `Você é a Zuri, uma IA especialista em tranças e gestão para profissionais no Brasil.
    
    Perfil do Usuário:
    - Nome: ${user?.name || 'Profissional'}
    - Nível: ${user?.plan === 'free' ? 'Iniciante/Intermediário' : 'Profissional'}
    - Gênero: ${user?.gender}
    
    INSTRUÇÃO DE GÊNERO: ${genderInstruction}
    ESTILO DE COMUNICAÇÃO OBRIGATÓRIO: ${styleInstruction}

    Tópicos: precificação, técnicas de trança (Box Braids, Nagô, etc), marketing para Instagram e gestão de salão.
    
    Pergunta da usuária: ${text}`;

    const response = await generateText(prompt);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  const suggestions = [
    "Quanto cobrar na Box Braids?",
    "Ideias de post pro Insta",
    "Diferença Knotless x Box Braids",
    "Como organizar minha agenda?"
  ];

  const heightClass = embedded ? "h-[600px]" : "h-[calc(100vh-140px)]";
  const isBlocked = timerStatus.status === 'blocked';

  if (!user) {
      return (
          <div className={`${heightClass} flex flex-col items-center justify-center bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700`}>
              <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/30 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LogIn size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">Login Necessário</h3>
                  <p className="text-stone-500 mb-6 max-w-xs mx-auto">Para conversar com a Zuri e salvar seu histórico, você precisa se identificar.</p>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="bg-gold-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors"
                  >
                      Fazer Login / Cadastro
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className={`${heightClass} flex flex-col bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden relative`}>
      
      {/* Visual Timer Banner */}
      {user?.plan === 'free' && (
          <div className={`w-full py-1.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors ${
              timerStatus.status === 'blocked' ? 'bg-red-500 text-white' : 
              timerStatus.status === 'active' ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
          }`}>
              <Clock size={12} />
              {timerStatus.status === 'idle' && "Sessão de 2h pronta para iniciar"}
              {timerStatus.status === 'active' && `Tempo restante: ${formatTime(timerStatus.msRemaining)}`}
              {timerStatus.status === 'blocked' && `Zuri volta em: ${formatTime(timerStatus.msRemaining)}`}
          </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center text-gold-600">
             <Bot size={18} />
           </div>
           <div>
             <h2 className="font-medium dark:text-stone-100 text-sm">Zuri</h2>
             <p className="text-[10px] text-stone-400 capitalize">Modo: {user?.communicationStyle || 'Parceira'}</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowPersonaSettings(!showPersonaSettings)}
                className="text-stone-400 hover:text-gold-500 transition-colors p-1"
                title="Personalizar Zuri"
            >
                <Settings size={18}/>
            </button>
            {user?.plan === 'free' && (
            <span className="text-xs text-stone-500 bg-white dark:bg-stone-700 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-600 flex items-center gap-1">
                <Lock size={10}/> Free
            </span>
            )}
        </div>
      </div>

      {/* Persona Settings Drawer */}
      {showPersonaSettings && (
          <div className="absolute top-24 left-0 right-0 bg-white dark:bg-stone-800 z-20 border-b border-stone-100 dark:border-stone-700 p-4 shadow-lg animate-fade-in">
              <h3 className="text-xs font-bold text-stone-400 uppercase mb-3">Escolha a personalidade da Zuri</h3>
              <div className="grid grid-cols-3 gap-2">
                 <button 
                    onClick={() => { updateProfile({ communicationStyle: 'parceira' }); setShowPersonaSettings(false); }}
                    className={`p-3 rounded-xl border text-center transition-all ${user?.communicationStyle === 'parceira' ? 'bg-gold-50 border-gold-500 text-gold-700 dark:bg-gold-900/20' : 'bg-stone-50 border-stone-200 text-stone-600 dark:bg-stone-700 dark:border-stone-600'}`}
                 >
                    <Smile className="mx-auto mb-1" size={18}/>
                    <span className="text-xs font-bold">Parceira</span>
                 </button>
                 <button 
                    onClick={() => { updateProfile({ communicationStyle: 'formal' }); setShowPersonaSettings(false); }}
                    className={`p-3 rounded-xl border text-center transition-all ${user?.communicationStyle === 'formal' ? 'bg-stone-800 border-stone-600 text-white dark:bg-stone-600' : 'bg-stone-50 border-stone-200 text-stone-600 dark:bg-stone-700 dark:border-stone-600'}`}
                 >
                    <Briefcase className="mx-auto mb-1" size={18}/>
                    <span className="text-xs font-bold">Formal</span>
                 </button>
                 <button 
                    onClick={() => { updateProfile({ communicationStyle: 'mentora' }); setShowPersonaSettings(false); }}
                    className={`p-3 rounded-xl border text-center transition-all ${user?.communicationStyle === 'mentora' ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/20' : 'bg-stone-50 border-stone-200 text-stone-600 dark:bg-stone-700 dark:border-stone-600'}`}
                 >
                    <Heart className="mx-auto mb-1" size={18}/>
                    <span className="text-xs font-bold">Mentora</span>
                 </button>
              </div>
          </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-stone-800 dark:bg-stone-600 text-white' : 'bg-gold-100 dark:bg-gold-900/50 text-gold-600'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
             </div>
             <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-stone-800 dark:bg-stone-600 text-white rounded-tr-none' : 'bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-tl-none'} ${m.content.includes('Limite') ? 'border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : ''}`}>
               {m.content}
               {m.content.includes('Limite') && (
                 <button onClick={() => navigate('/plans')} className="block mt-2 text-xs font-bold underline">Ver Planos</button>
               )}
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/50 flex items-center justify-center text-gold-600">
                <Bot size={16} />
             </div>
             <div className="bg-stone-100 dark:bg-stone-700 p-3 rounded-2xl rounded-tl-none flex items-center">
                <Loader2 className="animate-spin text-stone-400" size={16} />
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-stone-50 dark:bg-stone-800 border-t border-stone-100 dark:border-stone-700">
        {isBlocked && (
           <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-center">
               <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-1">A Zuri está descansando (Modo Free)</p>
               <button onClick={() => navigate('/plans')} className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                   Desbloquear Agora (Premium)
               </button>
           </div>
        )}
        
        {messages.length < 3 && !isBlocked && (
           <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-full text-xs text-stone-600 dark:text-stone-300 hover:border-gold-400 hover:text-gold-600 transition-colors"
                >
                  {s}
                </button>
              ))}
           </div>
        )}
        <div className="flex gap-2">
          <input 
            className="flex-1 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={isBlocked ? "Zuri indisponível..." : "Fala com a Zuri..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isBlocked && handleSend()}
            disabled={isBlocked || isLoading}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || isBlocked}
            className="bg-gold-500 text-white p-3 rounded-xl hover:bg-gold-600 disabled:opacity-50 disabled:bg-stone-400 transition-colors"
          >
            {isBlocked ? <Lock size={20}/> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
