
import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { Moon, Sun, Save, User, Mail, Phone, Lock, LogOut, ShieldCheck, QrCode, Globe, Crown, MessageSquare, Heart, Briefcase, Smile, BarChart2, Calendar } from 'lucide-react';
import { Transaction, Gender } from '../types';
import { useNavigate } from 'react-router-dom';

// Google Icon Component (Inline SVG for branded look)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login, loginWithGoogle, register, verifyCode, isAuthenticated, logout, sendVerificationCode, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [verificationStep, setVerificationStep] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Metrics State
  const [metrics, setMetrics] = useState({
    totalServices: 0,
    totalRevenue: 0,
    daysActive: 0
  });

  const isPremium = user?.plan === 'premium';

  useEffect(() => {
    if (isAuthenticated) {
       // Calculate metrics from localStorage
       const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
       const pricingHistory = JSON.parse(localStorage.getItem('pricingHistory') || '[]');
       
       const revenue = transactions
          .filter(t => t.type === 'income')
          .reduce((acc, curr) => acc + curr.value, 0);

       // Mock days active calculation based on random or user date
       const days = user?.memberSince ? Math.floor((new Date().getTime() - new Date(Date.parse(user.memberSince)).getTime()) / (1000 * 3600 * 24)) : 1;
       
       setMetrics({
         totalServices: pricingHistory.length,
         totalRevenue: revenue,
         daysActive: Math.max(1, days)
       });
    }
  }, [isAuthenticated, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (e) {
      setError('Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (e) {
      setError('Erro ao conectar com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      await sendVerificationCode(formData.phone || formData.email, formData.phone ? 'whatsapp' : 'email');
      setVerificationStep(true);
    } catch (e) {
      setError('Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const success = await verifyCode(code);
    if (!success) {
      setError('Código inválido.');
      setLoading(false);
    } else {
      setVerificationStep(false);
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    await sendVerificationCode(formData.phone || formData.email, formData.phone ? 'whatsapp' : 'email');
  };

  // --- RENDER: NOT LOGGED IN ---
  if (!isAuthenticated && !verificationStep) {
    return (
      <div className="max-w-md mx-auto py-10 animate-fade-in">
         <div className="text-center mb-8">
           <h2 className="text-3xl font-display text-stone-800 dark:text-stone-100 mb-2">Boas-vindas</h2>
           <p className="text-stone-500">Faça login para gerenciar seu negócio.</p>
         </div>

         <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-700">
            {/* Google Button */}
            <button 
               onClick={handleGoogleLogin}
               disabled={loading}
               className="w-full bg-white dark:bg-stone-100 text-stone-700 font-medium py-3 rounded-xl border border-stone-300 dark:border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-center gap-3 mb-6 shadow-sm"
            >
               {loading ? <span className="text-xs">Conectando...</span> : (
                 <>
                   <GoogleIcon />
                   <span>Continuar com Google</span>
                 </>
               )}
            </button>

            <div className="flex items-center gap-4 mb-6">
               <div className="h-px bg-stone-200 dark:bg-stone-600 flex-1"></div>
               <span className="text-xs text-stone-400 font-medium uppercase">ou email</span>
               <div className="h-px bg-stone-200 dark:bg-stone-600 flex-1"></div>
            </div>

            <div className="flex mb-6 border-b border-stone-100 dark:border-stone-700">
               <button 
                 onClick={() => setAuthMode('login')}
                 className={`flex-1 pb-3 text-sm font-bold ${authMode === 'login' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-stone-400'}`}
               >
                 Login
               </button>
               <button 
                 onClick={() => setAuthMode('register')}
                 className={`flex-1 pb-3 text-sm font-bold ${authMode === 'register' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-stone-400'}`}
               >
                 Criar Conta
               </button>
            </div>

            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
               {authMode === 'register' && (
                 <div>
                   <label className="text-xs font-bold text-stone-400 uppercase">Nome Completo</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 text-stone-400" size={16}/>
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 dark:text-stone-100"
                        placeholder="Seu nome"
                      />
                   </div>
                 </div>
               )}

               <div>
                   <label className="text-xs font-bold text-stone-400 uppercase">E-mail</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 text-stone-400" size={16}/>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 dark:text-stone-100"
                        placeholder="seu@email.com"
                      />
                   </div>
               </div>

               {authMode === 'register' && (
                 <div>
                   <label className="text-xs font-bold text-stone-400 uppercase">Telefone / WhatsApp</label>
                   <div className="relative">
                      <Phone className="absolute left-3 top-3 text-stone-400" size={16}/>
                      <input 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 dark:text-stone-100"
                        placeholder="(00) 00000-0000"
                      />
                   </div>
                   <p className="text-[10px] text-stone-400 mt-1">Enviaremos um código de verificação para este número.</p>
                 </div>
               )}

               <div>
                   <label className="text-xs font-bold text-stone-400 uppercase">Senha</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 text-stone-400" size={16}/>
                      <input 
                        type="password"
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 dark:text-stone-100"
                        placeholder="••••••••"
                      />
                   </div>
               </div>
               
               {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-stone-800 dark:bg-gold-500 text-white dark:text-stone-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
               >
                 {loading ? 'Processando...' : authMode === 'login' ? 'Entrar' : 'Cadastrar e Verificar'}
               </button>
            </form>
         </div>
         
         <div className="mt-8 bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
             <h3 className="font-medium mb-4 text-stone-800 dark:text-stone-200">Aparência do App</h3>
             <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-400 text-sm">Modo Escuro</span>
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-stone-700 text-gold-400' : 'bg-stone-100 text-stone-600'}`}
                >
                   {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
             </div>
          </div>
      </div>
    );
  }

  // --- RENDER: VERIFICATION ---
  if (!isAuthenticated && verificationStep) {
    return (
      <div className="max-w-md mx-auto py-10">
         <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-700 text-center animate-fade-in">
             <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-600">
                <ShieldCheck size={32} />
             </div>
             <h2 className="text-2xl font-display text-stone-800 dark:text-stone-100 mb-2">Verificação de Conta</h2>
             <p className="text-stone-500 text-sm mb-6">
               Insira o código enviado para <strong>{formData.phone || formData.email}</strong>
             </p>

             <input 
                className="w-full text-center text-3xl tracking-[10px] p-4 rounded-xl border-2 border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 dark:text-stone-100 focus:border-gold-500 outline-none mb-6 font-mono"
                placeholder="0000"
                maxLength={4}
                value={code}
                onChange={e => setCode(e.target.value)}
             />

             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

             <button 
               onClick={handleVerify}
               disabled={loading || code.length < 4}
               className="w-full bg-gold-500 text-white py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors mb-3"
             >
               {loading ? 'Verificando...' : 'Confirmar Código'}
             </button>
             
             <button onClick={handleResendCode} className="text-xs text-stone-400 underline hover:text-stone-600">
               Reenviar código
             </button>
         </div>
      </div>
    );
  }

  // --- RENDER: LOGGED IN (PROFILE DASHBOARD) ---
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Profile Header */}
      <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-stone-100 dark:border-stone-700 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-10">
            <User size={120} />
         </div>
         {isPremium && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
               <Crown size={12} fill="currentColor"/> PREMIUM
            </div>
         )}
         <div className="flex items-center gap-6 relative z-10">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-display border-4 border-white dark:border-stone-700 shadow-lg ${isPremium ? 'bg-gradient-to-br from-gold-400 to-amber-600' : 'bg-stone-400'}`}>
               {user?.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-2xl font-display text-stone-900 dark:text-stone-100">{user?.name}</h2>
               <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                    <ShieldCheck size={10} /> Conta Verificada
                  </span>
                  <span className="text-xs text-stone-400">Desde {user?.memberSince}</span>
               </div>
               {!isPremium && (
                  <button onClick={() => navigate('/plans')} className="text-xs text-gold-600 dark:text-gold-400 font-bold hover:underline mt-1">
                     Fazer Upgrade
                  </button>
               )}
            </div>
         </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-stone-900 dark:bg-stone-700 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
            {!isPremium && <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
               <Lock className="text-white/50" />
            </div>}
            <p className="text-stone-400 text-xs uppercase mb-1">Faturamento Total</p>
            <h3 className="text-2xl font-medium text-gold-400">R$ {metrics.totalRevenue.toFixed(2)}</h3>
            <div className="mt-2 text-xs text-stone-500 flex items-center gap-1">
               <BarChart2 size={12} /> Dados do Financeiro
            </div>
         </div>
         <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs uppercase mb-1">Serviços Realizados</p>
            <h3 className="text-2xl font-medium dark:text-stone-100">{metrics.totalServices}</h3>
            <div className="mt-2 text-xs text-green-500">Histórico de cálculo</div>
         </div>
         <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs uppercase mb-1">Dias Ativos</p>
            <h3 className="text-2xl font-medium dark:text-stone-100">{metrics.daysActive}</h3>
            <div className="mt-2 text-xs text-stone-400 flex items-center gap-1">
               <Calendar size={12} /> Uso contínuo
            </div>
         </div>
      </div>
      
      {/* Premium Profile Features */}
      {isPremium && (
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-5 rounded-2xl text-white flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-gold-400">Seu QR Code</h4>
                   <p className="text-xs text-stone-400">Para clientes escanearem</p>
                </div>
                <QrCode size={32} className="opacity-80"/>
             </div>
             <div className="bg-white dark:bg-stone-800 border border-gold-400/30 p-5 rounded-2xl flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-stone-800 dark:text-stone-100">Link Portfólio</h4>
                   <p className="text-xs text-stone-500">trancapro.app/{user.name.split(' ')[0].toLowerCase()}</p>
                </div>
                <Globe size={32} className="text-gold-500"/>
             </div>
         </div>
      )}

      {/* Settings Form */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 space-y-4">
         <h3 className="font-medium text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-700 pb-2">Meus Dados</h3>
         
         <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Nome Profissional</label>
              <input 
                value={user?.name || ''} 
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">E-mail</label>
              <input 
                value={user?.email || ''} 
                disabled
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Telefone / WhatsApp</label>
              <input 
                value={user?.phone || ''} 
                onChange={(e) => updateProfile({ phone: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Meta Principal</label>
              <input 
                placeholder="Ex: Abrir meu estúdio"
                value={user?.goal || ''}
                onChange={(e) => updateProfile({ goal: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-400"
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Gênero</label>
              <select 
                value={user?.gender || 'Prefiro não dizer'} 
                onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-400"
              >
                  <option value="Mulher Cis">Mulher Cis</option>
                  <option value="Mulher Trans">Mulher Trans</option>
                  <option value="Homem Cis">Homem Cis</option>
                  <option value="Homem Trans">Homem Trans</option>
                  <option value="Não-Binário">Não-Binário</option>
                  <option value="Agênero">Agênero</option>
                  <option value="Gênero Fluido">Gênero Fluido</option>
                  <option value="Travesti">Travesti</option>
                  <option value="Queer">Queer</option>
                  <option value="Prefiro não dizer">Prefiro não dizer</option>
                  <option value="Outro">Outro</option>
              </select>
            </div>
         </div>
         
         <div className="pt-2">
            <button className="bg-gold-500 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-gold-600 transition-colors shadow-sm text-sm">
               <Save size={16} /> Salvar Alterações
            </button>
         </div>
      </div>

      {/* Community & Feedback */}
      <div 
        onClick={() => navigate('/feedback')}
        className="bg-stone-900 dark:bg-stone-700 p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.01] transition-transform text-white flex items-center justify-between"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <MessageSquare size={24} className="text-gold-400" />
            </div>
            <div>
               <h3 className="font-bold text-lg">Fórum & Feedback</h3>
               <p className="text-sm text-stone-300">Dê sua opinião, tire dúvidas e ajude a melhorar o app.</p>
            </div>
         </div>
         <div className="bg-gold-500 p-2 rounded-full text-stone-900">
            <MessageSquare size={20} />
         </div>
      </div>

      {/* Appearance & Logout */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h3 className="font-medium text-stone-800 dark:text-stone-200">Aparência</h3>
               <p className="text-xs text-stone-500">Alternar entre modo claro e escuro</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-stone-700 text-gold-400' : 'bg-stone-100 text-stone-600'}`}
            >
               {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
         </div>

         <div className="pt-4 border-t border-stone-100 dark:border-stone-700">
            <button 
               onClick={logout}
               className="w-full py-3 border border-red-200 dark:border-red-900/50 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 font-medium"
            >
               <LogOut size={18} /> Sair da Conta
            </button>
         </div>
      </div>
    </div>
  );
};

export default SettingsPage;