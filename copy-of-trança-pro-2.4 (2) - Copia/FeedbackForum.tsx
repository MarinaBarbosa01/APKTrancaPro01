
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { MessageSquare, ThumbsUp, ThumbsDown, Send, Lock, Unlock, Trash2, CheckCircle, AlertCircle, User, MessageCircle } from 'lucide-react';
import { Feedback } from '../types';

// --- CREDENTIALS CONFIGURATION ---
const OWNER_CREDENTIALS = {
  cpf: '48070630817', // Raw numbers
  password: 'mari991900163',
};

const FeedbackForum = () => {
  const { user, submitFeedback, getFeedbacks, deleteFeedback } = useAuth();
  
  // Tabs: 'public' (Form) | 'admin' (List)
  const [activeTab, setActiveTab] = useState<'public' | 'admin'>('public');
  
  // Form State
  const [type, setType] = useState<'sugestao' | 'reclamacao' | 'elogio'>('sugestao');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin Auth State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCpf, setAdminCpf] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const feedbacks = getFeedbacks();

  const handleSubmit = () => {
    if (!message.trim()) return;
    submitFeedback({
        author: user?.name || 'Anônima',
        type,
        message
    });
    setMessage('');
    setSuccessMsg('Obrigada! Sua opinião é muito importante pra gente.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = adminCpf.replace(/\D/g, '');
    if (cleanCpf === OWNER_CREDENTIALS.cpf && adminPass === OWNER_CREDENTIALS.password) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setActiveTab('admin');
        setLoginError('');
    } else {
        setLoginError('Acesso negado.');
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-light dark:text-stone-100">Fórum & Feedback</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Sua voz ajuda o Trança Pro a crescer.</p>
         </div>
         <button 
           onClick={() => {
              if (isAdmin) setActiveTab('admin');
              else setShowAdminLogin(!showAdminLogin);
           }}
           className="p-2 rounded-full border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400"
         >
           {isAdmin ? <Unlock size={18} className="text-green-500"/> : <Lock size={18}/>}
         </button>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showAdminLogin && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl w-full max-w-sm shadow-xl border border-stone-200 dark:border-stone-700 animate-fade-in relative">
                 <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-stone-400"><Trash2 size={18} className="rotate-45"/></button>
                 <h3 className="font-bold text-lg mb-4 text-center dark:text-stone-100">Área da Administração</h3>
                 <form onSubmit={handleAdminLogin} className="space-y-4">
                     <input 
                       placeholder="CPF"
                       value={adminCpf}
                       onChange={e => setAdminCpf(e.target.value)}
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                     />
                     <input 
                       type="password"
                       placeholder="Senha"
                       value={adminPass}
                       onChange={e => setAdminPass(e.target.value)}
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                     />
                     {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
                     <button type="submit" className="w-full bg-gold-500 text-white py-3 rounded-xl font-bold">Entrar</button>
                 </form>
             </div>
         </div>
      )}

      {/* TABS */}
      {isAdmin && (
         <div className="flex mb-6 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button onClick={() => setActiveTab('public')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === 'public' ? 'bg-white dark:bg-stone-700 shadow-sm' : 'text-stone-500'}`}>Enviar Feedback</button>
            <button onClick={() => setActiveTab('admin')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === 'admin' ? 'bg-white dark:bg-stone-700 shadow-sm' : 'text-stone-500'}`}>Ver Respostas ({feedbacks.length})</button>
         </div>
      )}

      {activeTab === 'public' && (
         <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
             <div className="mb-6">
                <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Sobre o que você quer falar?</label>
                <div className="flex gap-2">
                   <button onClick={() => setType('sugestao')} className={`flex-1 py-3 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${type === 'sugestao' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20' : 'border-stone-200 dark:border-stone-700 text-stone-500'}`}>
                      <MessageCircle size={18}/> Sugestão
                   </button>
                   <button onClick={() => setType('elogio')} className={`flex-1 py-3 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${type === 'elogio' ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20' : 'border-stone-200 dark:border-stone-700 text-stone-500'}`}>
                      <ThumbsUp size={18}/> Elogio
                   </button>
                   <button onClick={() => setType('reclamacao')} className={`flex-1 py-3 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${type === 'reclamacao' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20' : 'border-stone-200 dark:border-stone-700 text-stone-500'}`}>
                      <ThumbsDown size={18}/> Reclamação
                   </button>
                </div>
             </div>

             <div className="mb-6">
                <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Sua Mensagem</label>
                <textarea 
                  rows={4}
                  placeholder="Conta pra gente o que você tá achando ou o que pode melhorar..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-gold-400 resize-none"
                />
             </div>

             {successMsg ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-xl flex items-center gap-2 justify-center animate-fade-in">
                   <CheckCircle size={20} /> {successMsg}
                </div>
             ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                  className="w-full bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} /> Enviar Feedback
                </button>
             )}
         </div>
      )}

      {activeTab === 'admin' && (
         <div className="space-y-4">
             {feedbacks.length === 0 ? (
                 <div className="text-center py-10 text-stone-400">Nenhum feedback recebido ainda.</div>
             ) : (
                 feedbacks.map(fb => (
                     <div key={fb.id} className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 relative">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                   fb.type === 'elogio' ? 'bg-green-100 text-green-700' :
                                   fb.type === 'reclamacao' ? 'bg-red-100 text-red-700' :
                                   'bg-blue-100 text-blue-700'
                               }`}>
                                   {fb.type}
                               </span>
                               <span className="text-xs text-stone-400">{fb.date}</span>
                            </div>
                            <button onClick={() => deleteFeedback(fb.id)} className="text-stone-300 hover:text-red-500"><Trash2 size={16}/></button>
                         </div>
                         <p className="text-stone-800 dark:text-stone-200 text-sm mb-2">{fb.message}</p>
                         <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
                            <User size={12}/> Enviado por: {fb.author}
                         </div>
                     </div>
                 ))
             )}
         </div>
      )}
    </div>
  );
};

export default FeedbackForum;
