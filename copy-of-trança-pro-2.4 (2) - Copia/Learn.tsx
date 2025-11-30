
import React, { useState, useEffect } from 'react';
import { EducationalContent } from '../types';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  FileText, 
  Plus, 
  Trash2, 
  Youtube, 
  MonitorPlay,
  Lock,
  Unlock,
  User,
  Key,
  X,
  Mail,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Info,
  ShieldAlert,
  Newspaper
} from 'lucide-react';

// --- MOCK DATA ---

const INITIAL_GUIDES: EducationalContent[] = [
  {
    id: '1',
    title: 'Como Calcular o Valor da Sua Hora',
    category: 'Precificação',
    readTime: '5 min',
    learnList: ['Custos fixos', 'Definição de salário', 'Cálculo hora'],
    content: `Para saber quanto cobrar, você precisa saber quanto vale sua hora.\n1. Some todos os custos fixos.\n2. Defina seu salário.\n3. Divida pelo total de horas trabalhadas.`
  },
  {
    id: '2',
    title: 'Tabela de Preços Estratégica',
    category: 'Gestão',
    readTime: '7 min',
    learnList: ['Estrutura', 'Tamanhos', 'Adicionais'],
    content: `Separe por técnica, comprimento e espessura. Sempre coloque "A partir de" para casos complexos.`
  },
  {
    id: '3',
    title: 'Marketing para Trancistas',
    category: 'Marketing',
    readTime: '10 min',
    learnList: ['Bio do Instagram', 'Stories', 'Reels'],
    content: `Seu Instagram é sua vitrine. Use luz natural para fotos e mostre os bastidores nos stories.`
  }
];

const INITIAL_MATERIALS = [
  { id: '1', title: 'Apostila Completa: Divisões Geométricas', type: 'PDF', size: 'Link Externo', downloads: 120, url: '#' },
  { id: '2', title: 'E-book: Cronograma Capilar Pós-Trança', type: 'E-Book', size: 'Link Externo', downloads: 85, url: '#' },
  { id: '3', title: 'Contrato de Prestação de Serviço', type: 'DOC', size: 'Link Externo', downloads: 340, url: '#' },
];

const INITIAL_VIDEOS = [
  { id: '1', title: 'Aula: Box Braids para Iniciantes (Passo a Passo)', duration: '12:45', author: 'Jacy July', views: '200k', isLive: false, thumbnail: 'bg-stone-800', url: 'https://www.youtube.com/watch?v=HuW3t_gJO4k' },
  { id: '2', title: 'Live: Como Lotar sua Agenda de Clientes', duration: '55:00', author: 'Trancista de Sucesso', views: '15k', isLive: true, thumbnail: 'bg-red-900', url: 'https://www.youtube.com/watch?v=Fj6k3s0c_wU' },
  { id: '3', title: 'Dica: Acabamento Perfeito na Raiz', duration: '08:20', author: 'Afro Hair Academy', views: '50k', isLive: false, thumbnail: 'bg-stone-700', url: 'https://www.youtube.com/watch?v=kjZqW-rB52w' },
];

const INITIAL_JOURNALISM = [
  { id: '1', title: 'A ascensão das tranças nagô na moda internacional', source: 'Vogue Brasil', url: 'https://vogue.globo.com' },
  { id: '2', title: 'Mercado de beleza negra movimenta bilhões no Brasil', source: 'Mundo Negro', url: 'https://mundonegro.inf.br' },
  { id: '3', title: 'Cuidados essenciais com o couro cabeludo no verão', source: 'Revista Claudia', url: 'https://claudia.abril.com.br' },
];

// --- CREDENTIALS CONFIGURATION ---
const OWNER_CREDENTIALS = {
  cpf: '48070630817', // Raw numbers
  password: 'mari991900163',
  recoveryEmail: 'marynaa220@gmail.com',
  securityAnswer: 'ataerneson' // Normalized to lowercase for check
};

// --- COMPONENT ---

const Learn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'guides' | 'materials' | 'videos' | 'journalism'>('guides');
  
  // Auth State
  const [isOwnerMode, setIsOwnerMode] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showVideoContributionModal, setShowVideoContributionModal] = useState(false);
  
  // Login Form
  const [cpfInput, setCpfInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Recovery Form
  const [emailInput, setEmailInput] = useState('');
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Content Data States
  const [guides, setGuides] = useState(INITIAL_GUIDES);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [journalism, setJournalism] = useState(INITIAL_JOURNALISM);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Add Content Form States
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'PDF', url: '' });
  const [newVideo, setNewVideo] = useState({ title: '', duration: '', isLive: false, url: '' });
  const [newArticle, setNewArticle] = useState({ title: '', source: '', url: '' });

  // Copied State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load content from localStorage on mount
  useEffect(() => {
    const savedMaterials = localStorage.getItem('learn_materials');
    const savedVideos = localStorage.getItem('learn_videos');
    const savedJournalism = localStorage.getItem('learn_journalism');
    
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
    if (savedVideos) setVideos(JSON.parse(savedVideos));
    if (savedJournalism) setJournalism(JSON.parse(savedJournalism));
  }, []);

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  // --- AUTH HANDLERS ---

  const handleOwnerClick = () => {
    if (isOwnerMode) {
      setIsOwnerMode(false); // Logout
    } else {
      setShowLoginModal(true); // Open Login
      setLoginError('');
      setCpfInput('');
      setPasswordInput('');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpfInput.replace(/\D/g, ''); // Remove dots/dashes
    
    if (cleanCpf === OWNER_CREDENTIALS.cpf && passwordInput === OWNER_CREDENTIALS.password) {
      setIsOwnerMode(true);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('CPF ou Senha incorretos.');
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedAnswer = securityAnswerInput.trim().toLowerCase();
    
    if (emailInput === OWNER_CREDENTIALS.recoveryEmail && normalizedAnswer === OWNER_CREDENTIALS.securityAnswer) {
      setRecoveryStatus('success');
    } else {
      setRecoveryStatus('error');
    }
  };

  // --- CONTENT HANDLERS ---
  
  const handleOpenVideoContribution = () => {
    if (user?.plan !== 'premium' && !isOwnerMode) {
        if (confirm("Esse recurso é exclusivo para assinantes Premium. Deseja conhecer os planos?")) {
            navigate('/plans');
        }
        return;
    }
    setShowVideoContributionModal(true);
  };

  const handleAddMaterial = () => {
    if (!newMaterial.title) return;
    const item = { 
      ...newMaterial, 
      id: Date.now().toString(), 
      size: 'Link Externo', 
      downloads: 0,
      url: newMaterial.url || '#' 
    };
    const updated = [item, ...materials];
    setMaterials(updated);
    localStorage.setItem('learn_materials', JSON.stringify(updated));
    setNewMaterial({ title: '', type: 'PDF', url: '' });
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url) {
      alert("Por favor, preencha o título e o link.");
      return;
    }

    const authorName = isOwnerMode ? 'Admin Oficial' : (user?.name || 'Membro da Comunidade');
    const authorThumbnail = isOwnerMode ? 'bg-stone-900' : 'bg-gold-500';

    const item = { 
      ...newVideo, 
      id: Date.now().toString(), 
      author: authorName, 
      views: '0', 
      thumbnail: authorThumbnail,
      url: newVideo.url
    };
    
    const updated = [item, ...videos];
    setVideos(updated);
    localStorage.setItem('learn_videos', JSON.stringify(updated));
    
    setNewVideo({ title: '', duration: '', isLive: false, url: '' });
    setShowVideoContributionModal(false); // Close modal if open
    
    if (!isOwnerMode) {
      alert("Obrigada por contribuir! Seu vídeo foi adicionado à lista.");
    }
  };

  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.url) return;
    const item = { 
      ...newArticle, 
      id: Date.now().toString()
    };
    const updated = [item, ...journalism];
    setJournalism(updated);
    localStorage.setItem('learn_journalism', JSON.stringify(updated));
    setNewArticle({ title: '', source: '', url: '' });
  };

  const handleDelete = (id: string, type: 'material' | 'video' | 'journalism') => {
    if (confirm('Tem certeza que deseja apagar este conteúdo?')) {
        if (type === 'material') {
            const updated = materials.filter(m => m.id !== id);
            setMaterials(updated);
            localStorage.setItem('learn_materials', JSON.stringify(updated));
        }
        if (type === 'video') {
            const updated = videos.filter(v => v.id !== id);
            setVideos(updated);
            localStorage.setItem('learn_videos', JSON.stringify(updated));
        }
        if (type === 'journalism') {
            const updated = journalism.filter(j => j.id !== id);
            setJournalism(updated);
            localStorage.setItem('learn_journalism', JSON.stringify(updated));
        }
    }
  };

  const openLink = (url: string) => {
    if (!url || url === '#') {
      alert("Link não disponível.");
      return;
    }
    window.open(url, '_blank');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 relative animate-fade-in">
      {/* Header & Owner Toggle */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-light dark:text-stone-100 font-display">Hub de Aprendizado</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Evolua sua técnica e seu negócio.</p>
        </div>
        <button 
          onClick={handleOwnerClick}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-2 ${isOwnerMode ? 'bg-gold-500 text-white border-transparent' : 'border-stone-200 text-stone-400 dark:border-stone-700 hover:border-gold-400 hover:text-gold-500'}`}
        >
          {isOwnerMode ? <Unlock size={12}/> : <Lock size={12}/>} 
          {isOwnerMode ? 'Modo Admin' : 'Área de Gestão'}
        </button>
      </div>

      {/* --- MODALS (Login/Recovery/Video Contribution) --- */}
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-stone-200 dark:border-stone-600 relative animate-fade-in">
             <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"><X size={20}/></button>
             
             <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/30 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock size={28} />
                </div>
                <h3 className="text-xl font-display dark:text-stone-100">Acesso Restrito</h3>
                <p className="text-sm text-stone-500">Área exclusiva para a administração.</p>
             </div>

             <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 uppercase mb-1">CPF</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-stone-400" size={16} />
                    <input 
                      className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 transition-colors dark:text-stone-100" 
                      placeholder="000.000.000-00"
                      value={cpfInput}
                      onChange={e => setCpfInput(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 uppercase mb-1">Senha</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 text-stone-400" size={16} />
                    <input 
                      type="password"
                      className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 transition-colors dark:text-stone-100" 
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                    />
                  </div>
                </div>
                
                {loginError && (
                  <div className="text-red-500 text-xs flex items-center gap-1 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    <AlertCircle size={14} /> {loginError}
                  </div>
                )}

                <button type="submit" className="w-full bg-gold-500 text-white py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors shadow-lg">
                  Entrar no Painel
                </button>
             </form>

             <div className="mt-4 text-center">
                <button 
                  type="button"
                  onClick={() => { setShowLoginModal(false); setShowRecoveryModal(true); setRecoveryStatus('idle'); }}
                  className="text-xs text-stone-400 hover:text-gold-500 underline"
                >
                  Esqueci minha senha
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-stone-200 dark:border-stone-600 relative animate-fade-in">
             <button onClick={() => setShowRecoveryModal(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"><X size={20}/></button>
             
             <div className="text-center mb-6">
                <h3 className="text-xl font-display dark:text-stone-100">Recuperação de Acesso</h3>
                <p className="text-sm text-stone-500">Responda a pergunta de segurança.</p>
             </div>

             {recoveryStatus === 'success' ? (
               <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg dark:text-stone-100">Dados Confirmados!</h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                      Um e-mail de redefinição foi enviado para:<br/>
                      <span className="font-medium text-stone-800 dark:text-stone-200">{emailInput}</span>
                    </p>
                  </div>
                  <button onClick={() => setShowRecoveryModal(false)} className="text-gold-500 font-bold text-sm hover:underline">Fechar</button>
               </div>
             ) : (
               <form onSubmit={handleRecoverySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 uppercase mb-1">E-mail Cadastrado</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-stone-400" size={16} />
                      <input 
                        type="email"
                        className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 transition-colors dark:text-stone-100" 
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 uppercase mb-1 flex items-center gap-1">
                      <HelpCircle size={12}/> Pergunta de Segurança
                    </label>
                    <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-sm text-stone-600 dark:text-stone-400 mb-2 border border-stone-200 dark:border-stone-700">
                      Nome do melhor amigo de infância?
                    </div>
                    <input 
                      className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-400 transition-colors dark:text-stone-100" 
                      placeholder="Sua resposta..."
                      value={securityAnswerInput}
                      onChange={e => setSecurityAnswerInput(e.target.value)}
                    />
                  </div>
                  
                  {recoveryStatus === 'error' && (
                    <div className="text-red-500 text-xs flex items-center gap-1 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <AlertCircle size={14} /> Dados incorretos. Tente novamente.
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => { setShowRecoveryModal(false); setShowLoginModal(true); }}
                      className="flex-1 border border-stone-200 dark:border-stone-600 text-stone-500 py-3 rounded-xl font-medium hover:bg-stone-50 dark:hover:bg-stone-700"
                    >
                      Voltar
                    </button>
                    <button type="submit" className="flex-[2] bg-stone-800 dark:bg-stone-700 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
                      Verificar Dados
                    </button>
                  </div>
               </form>
             )}
          </div>
        </div>
      )}

      {/* Video Contribution Modal */}
      {showVideoContributionModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-stone-200 dark:border-stone-600 relative animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
               <button onClick={() => setShowVideoContributionModal(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"><X size={20}/></button>

               <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-10 h-10 bg-gold-100 dark:bg-gold-900/30 text-gold-600 rounded-full flex items-center justify-center">
                        <Video size={20} />
                     </div>
                     <h3 className="text-xl font-bold dark:text-stone-100">Adicionar Vídeo</h3>
                  </div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Contribua com o aprendizado da comunidade.</p>
               </div>

               {/* Rules Alert */}
               <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-6">
                  <h4 className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm mb-2">
                     <ShieldAlert size={16}/> Regras Importantes
                  </h4>
                  <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-2 list-disc pl-4">
                     <li><strong>Apenas conteúdo relacionado:</strong> Tranças, Cabelo Afro, Penteados, Marketing para Trancistas ou Gestão de Salão.</li>
                     <li><strong>Proibido:</strong> Conteúdo ofensivo, político, religioso ou que viole direitos autorais.</li>
                     <li><strong>Qualidade:</strong> Verifique se o link está funcionando antes de enviar.</li>
                     <li>Conteúdos repetidos ou fora do tema serão removidos pela administração.</li>
                  </ul>
               </div>

               <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Título do Vídeo</label>
                      <input 
                         placeholder="Ex: Como fazer divisão em triângulo"
                         className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-500 dark:text-stone-100"
                         value={newVideo.title}
                         onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Link do Vídeo</label>
                      <input 
                         placeholder="Cole o link do YouTube, Vimeo, etc."
                         className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-500 dark:text-stone-100"
                         value={newVideo.url}
                         onChange={e => setNewVideo({...newVideo, url: e.target.value})}
                      />
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Duração</label>
                        <input 
                           placeholder="Ex: 15:00"
                           className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none focus:border-gold-500 dark:text-stone-100"
                           value={newVideo.duration}
                           onChange={e => setNewVideo({...newVideo, duration: e.target.value})}
                        />
                     </div>
                     <div className="flex items-end pb-3">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                           <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newVideo.isLive ? 'bg-red-500 border-red-500' : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700'}`}>
                              {newVideo.isLive && <Check size={14} className="text-white"/>}
                           </div>
                           <input 
                              type="checkbox" 
                              className="hidden"
                              checked={newVideo.isLive}
                              onChange={e => setNewVideo({...newVideo, isLive: e.target.checked})}
                           />
                           <span className="text-sm font-medium text-stone-700 dark:text-stone-300">É uma Live?</span>
                        </label>
                     </div>
                  </div>

                  <button 
                     onClick={handleAddVideo}
                     className="w-full bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                  >
                     <Plus size={18}/> Enviar para a Comunidade
                  </button>
                  <p className="text-[10px] text-center text-stone-400">Ao enviar, você concorda com as regras acima.</p>
               </div>
            </div>
         </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-x-auto">
        {[
          { id: 'guides', label: 'Guia Rápido', icon: BookOpen },
          { id: 'materials', label: 'Materiais & PDFs', icon: FileText },
          { id: 'videos', label: 'Aulas & Lives', icon: Video },
          { id: 'journalism', label: 'Jornalismo', icon: Newspaper },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-gold-400 shadow-sm' 
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTENT: GUIDES --- */}
      {activeTab === 'guides' && (
        <div className="space-y-4 animate-fade-in">
          {guides.map((item) => (
            <div key={item.id} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden transition-all">
              <div 
                className="p-6 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-700/50 flex justify-between items-start"
                onClick={() => toggleExpand(item.id)}
              >
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/30 px-2 py-1 rounded">{item.category}</span>
                    <span className="text-xs text-stone-400 flex items-center gap-1"><Clock size={12}/> {item.readTime}</span>
                  </div>
                  <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200">{item.title}</h3>
                </div>
                <div className="text-stone-400">
                  {expandedId === item.id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {expandedId === item.id && (
                <div className="px-6 pb-6 pt-0 border-t border-stone-100 dark:border-stone-700 mt-2">
                  <div className="mt-4 mb-4 bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl">
                     <h4 className="font-medium text-xs uppercase tracking-wide mb-2 text-stone-500 dark:text-stone-400">Nesta aula:</h4>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-stone-600 dark:text-stone-300">
                        {item.learnList.map((l, i) => <li key={i} className="flex items-center gap-2"><div className="w-1 h-1 bg-gold-500 rounded-full"></div> {l}</li>)}
                     </ul>
                  </div>
                  <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-stone-600 dark:text-stone-300">
                     {item.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* --- CONTENT: MATERIALS --- */}
      {activeTab === 'materials' && (
        <div className="space-y-6 animate-fade-in">
          {isOwnerMode && (
             <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 relative">
                <div className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">ADMIN</div>
                <h4 className="font-medium text-sm mb-3 dark:text-stone-200 flex items-center gap-2"><Plus size={16}/> Adicionar Novo Material</h4>
                <div className="flex flex-col gap-3">
                   <div className="flex gap-2">
                      <input 
                          placeholder="Nome da apostila"
                          className="flex-1 p-3 rounded-xl text-sm border-none outline-none dark:bg-stone-700 dark:text-stone-100"
                          value={newMaterial.title}
                          onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                      />
                      <select 
                          className="p-3 rounded-xl text-sm border-none outline-none dark:bg-stone-700 dark:text-stone-100"
                          value={newMaterial.type}
                          onChange={e => setNewMaterial({...newMaterial, type: e.target.value})}
                      >
                        <option value="PDF">PDF</option>
                        <option value="E-Book">E-Book</option>
                        <option value="Planilha">Planilha</option>
                      </select>
                   </div>
                   <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                         <LinkIcon className="absolute left-3 top-3.5 text-stone-400" size={14} />
                         <input 
                             placeholder="Link do Google Drive / Canva / Dropbox"
                             className="w-full pl-9 p-3 rounded-xl text-sm border-none outline-none dark:bg-stone-700 dark:text-stone-100"
                             value={newMaterial.url}
                             onChange={e => setNewMaterial({...newMaterial, url: e.target.value})}
                         />
                      </div>
                      <button onClick={handleAddMaterial} className="bg-gold-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gold-600 transition-colors">
                        Salvar
                      </button>
                   </div>
                   <p className="text-[10px] text-stone-500">Cole o link público do arquivo (ex: drive.google.com/...).</p>
                </div>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat) => (
              <div key={mat.id} className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 flex items-center justify-between group hover:border-gold-200 dark:hover:border-gold-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-xl flex items-center justify-center text-stone-500 dark:text-stone-300 group-hover:bg-gold-50 dark:group-hover:bg-gold-900/20 group-hover:text-gold-600 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-800 dark:text-stone-200 text-sm line-clamp-1">{mat.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-bold bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded text-stone-500">{mat.type}</span>
                       <span className="text-xs text-stone-400">{mat.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {isOwnerMode ? (
                     <button onClick={() => handleDelete(mat.id, 'material')} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                   ) : (
                     <button 
                        onClick={() => openLink(mat.url || '#')}
                        className="p-2 text-gold-500 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg transition-colors" 
                        title="Abrir Material"
                      >
                       <ExternalLink size={20} />
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-stone-800 to-stone-900 dark:from-stone-700 dark:to-stone-800 text-white p-6 rounded-2xl flex items-center justify-between">
             <div>
                <h4 className="font-display text-lg mb-1">Quer conteúdos exclusivos?</h4>
                <p className="text-sm text-stone-400">Assine o Premium e desbloqueie apostilas técnicas avançadas.</p>
             </div>
             <button className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                Ver Planos
             </button>
          </div>
        </div>
      )}

      {/* --- CONTENT: VIDEOS --- */}
      {activeTab === 'videos' && (
        <div className="space-y-6 animate-fade-in">
           {/* Add Video Button (For Everyone) */}
           <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                 <h3 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <Video size={20} className="text-gold-500"/> Contribua com a Comunidade
                 </h3>
                 <p className="text-sm text-stone-500 dark:text-stone-400">Tem um vídeo top ou uma dica que ajudou? Compartilha com a gente!</p>
              </div>
              <button 
                 onClick={handleOpenVideoContribution}
                 className="bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
              >
                 {user?.plan !== 'premium' && <Lock size={14}/>}
                 <Plus size={16} /> Adicionar Vídeo
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div key={vid.id} className="group bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm border border-stone-100 dark:border-stone-700 hover:shadow-lg transition-all flex flex-col">
                  {/* Card Header/Icon */}
                  <div className={`h-32 ${vid.thumbnail} relative flex items-center justify-center bg-stone-900`}>
                     <div className="absolute inset-0 bg-black/40"></div>
                     {vid.isLive && (
                         <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse flex items-center gap-1 z-10">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> AO VIVO
                         </div>
                     )}
                     
                     <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                        <Youtube size={24} />
                     </div>
                     
                     {isOwnerMode && (
                       <button onClick={() => handleDelete(vid.id, 'video')} className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded hover:bg-red-500 transition-colors z-20">
                         <Trash2 size={14} />
                       </button>
                     )}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                     <h3 className="font-medium text-stone-900 dark:text-stone-100 leading-tight mb-2 line-clamp-2">{vid.title}</h3>
                     
                     <div className="flex justify-between items-center text-xs text-stone-500 dark:text-stone-400 mb-4">
                        <span className="flex items-center gap-1" title={vid.author}>
                           <User size={12}/> {vid.author.length > 15 ? vid.author.slice(0, 15) + '...' : vid.author}
                        </span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {vid.duration}</span>
                     </div>

                     <div className="mt-auto flex gap-2">
                        <button 
                           onClick={() => openLink(vid.url || '#')}
                           className="flex-1 bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                           <ExternalLink size={16} /> Assistir
                        </button>
                        <button 
                           onClick={() => copyToClipboard(vid.url || '', vid.id)}
                           className="px-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                           title="Copiar Link"
                        >
                           {copiedId === vid.id ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                        </button>
                     </div>
                  </div>
              </div>
            ))}
          </div>

          <div className="text-center py-8">
             <p className="text-stone-400 text-sm mb-4">Novas aulas toda semana!</p>
             <button className="text-gold-600 dark:text-gold-400 font-medium hover:underline text-sm">Ver arquivo completo &rarr;</button>
          </div>
        </div>
      )}

      {/* --- CONTENT: JOURNALISM --- */}
      {activeTab === 'journalism' && (
         <div className="space-y-6 animate-fade-in">
            {isOwnerMode && (
               <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 relative">
                  <div className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">ADMIN</div>
                  <h4 className="font-medium text-sm mb-3 dark:text-stone-200 flex items-center gap-2"><Plus size={16}/> Adicionar Notícia</h4>
                  <div className="flex flex-col gap-3">
                     <input 
                        placeholder="Título da Matéria"
                        className="p-3 rounded-xl text-sm border-none outline-none dark:bg-stone-700 dark:text-stone-100"
                        value={newArticle.title}
                        onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                     />
                     <div className="flex gap-2">
                        <input 
                           placeholder="Nome do Site / Fonte (ex: Vogue)"
                           className="flex-1 p-3 rounded-xl text-sm border-none outline-none dark:bg-stone-700 dark:text-stone-100"
                           value={newArticle.source}
                           onChange={e => setNewArticle({...newArticle, source: e.target.value})}
                        />
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                           <LinkIcon className="absolute left-3 top-3.5 text-stone-400" size={14} />
                           <input 
                               placeholder="Link da Notícia"
                               className="w-full pl-9 p-3 rounded-xl text-sm border-none outline-none dark:bg-stone-700 dark:text-stone-100"
                               value={newArticle.url}
                               onChange={e => setNewArticle({...newArticle, url: e.target.value})}
                           />
                        </div>
                        <button onClick={handleAddArticle} className="bg-gold-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gold-600 transition-colors">
                          Salvar
                        </button>
                     </div>
                  </div>
               </div>
            )}

            <div className="grid gap-4">
               {journalism.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-gold-200 dark:hover:border-gold-500/30 transition-all">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-xl flex items-center justify-center text-stone-500 dark:text-stone-300 group-hover:bg-gold-50 dark:group-hover:bg-gold-900/20 group-hover:text-gold-600 transition-colors shrink-0">
                           <Newspaper size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight mb-1">{item.title}</h4>
                           <p className="text-sm text-stone-500 dark:text-stone-400">Fonte: <span className="font-medium text-gold-600 dark:text-gold-400">{item.source}</span></p>
                        </div>
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                           onClick={() => openLink(item.url)}
                           className="flex-1 sm:flex-none bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                           Ler Matéria <ExternalLink size={14}/>
                        </button>
                        {isOwnerMode && (
                           <button onClick={() => handleDelete(item.id, 'journalism')} className="p-3 text-stone-400 hover:text-red-500 bg-stone-100 dark:bg-stone-700 rounded-xl transition-colors">
                              <Trash2 size={18}/>
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>

            <div className="text-center py-8">
               <p className="text-stone-400 text-sm">Atualizações sobre o mercado afro toda semana.</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default Learn;