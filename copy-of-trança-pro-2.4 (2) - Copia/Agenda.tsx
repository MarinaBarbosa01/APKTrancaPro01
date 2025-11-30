
import React, { useState, useEffect } from 'react';
import { Appointment, BraidService, PublicProfileSettings } from '../types';
import { Trash2, Plus, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Lock, Link as LinkIcon, Share2, Settings, Check, Copy, Edit2, DollarSign, Package, Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Agenda = () => {
  const { user, updatePublicProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'calendar' | 'settings'>('calendar');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const isPremium = user?.plan === 'premium';

  // Form State for Appointment
  const [newClient, setNewClient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newService, setNewService] = useState(''); // Stores service name
  const [newTime, setNewTime] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Settings State
  const [username, setUsername] = useState(user?.publicProfile?.username || '');
  const [tempBio, setTempBio] = useState(user?.publicProfile?.bio || '');
  const [tempPolicies, setTempPolicies] = useState(user?.publicProfile?.policies || '');
  const [workingHours, setWorkingHours] = useState(user?.publicProfile?.workingHours || {});
  const [googleSync, setGoogleSync] = useState(user?.publicProfile?.googleSyncEnabled || false);
  
  // Service Management State
  const [myServices, setMyServices] = useState<BraidService[]>(user?.publicProfile?.services || []);
  const [editingService, setEditingService] = useState<BraidService | null>(null); // If null, adding new. If object, editing.
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Initialize appointments
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  // Sync settings local state if user context updates
  useEffect(() => {
    if (user?.publicProfile) {
      setUsername(user.publicProfile.username);
      setTempBio(user.publicProfile.bio);
      setTempPolicies(user.publicProfile.policies);
      setWorkingHours(user.publicProfile.workingHours);
      setMyServices(user.publicProfile.services);
      setGoogleSync(user.publicProfile.googleSyncEnabled);
    }
  }, [user]);

  // Set default service for dropdown
  useEffect(() => {
    if (myServices.length > 0 && !newService) {
        setNewService(myServices[0].name);
    }
  }, [myServices]);

  // Helper to format date key YYYY-MM-DD (Local Time)
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const saveAppointment = () => {
    if (!newClient || !newTime) return;
    
    const dateStr = formatDateKey(selectedDate);

    const appt: Appointment = {
      id: Date.now().toString(),
      clientName: newClient,
      clientPhone: newPhone,
      service: newService,
      date: dateStr,
      time: newTime,
      notes: newNotes,
      status: 'confirmed',
      origin: 'app_manual',
      createdAt: new Date().toISOString()
    };

    const updated = [...appointments, appt].sort((a, b) => {
        return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
    });
    
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    setShowForm(false);
    setNewClient('');
    setNewPhone('');
    setNewTime('');
    setNewNotes('');
  };

  const deleteAppt = (id: string) => {
    if(confirm('Tem certeza que deseja cancelar este agendamento?')) {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      localStorage.setItem('appointments', JSON.stringify(updated));
    }
  };

  // Service CRUD
  const handleSaveService = (service: BraidService) => {
      let updatedServices;
      if (myServices.find(s => s.id === service.id)) {
          // Edit
          updatedServices = myServices.map(s => s.id === service.id ? service : s);
      } else {
          // Add
          updatedServices = [...myServices, service];
      }
      setMyServices(updatedServices);
      // We don't save to backend immediately, user must click "Salvar Configurações" or we can auto-save services
      // Let's auto-save services to context for better UX
      updatePublicProfile({ services: updatedServices });
      setShowServiceModal(false);
      setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
      if(confirm('Quer mesmo apagar esse serviço da lista?')) {
          const updated = myServices.filter(s => s.id !== id);
          setMyServices(updated);
          updatePublicProfile({ services: updated });
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && editingService) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditingService({ ...editingService, image: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const openServiceModal = (service?: BraidService) => {
      if (service) {
          setEditingService(service);
      } else {
          setEditingService({
              id: Date.now().toString(),
              name: '',
              avgTime: 4,
              price: 150,
              description: '',
              materialReq: '',
              image: ''
          });
      }
      setShowServiceModal(true);
  };

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    
    const totalSlots = 42;
    const remaining = totalSlots - days.length;
    for (let i = 0; i < remaining; i++) days.push(null);
    
    return days;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const isSelected = (date: Date) => formatDateKey(date) === formatDateKey(selectedDate);
  
  const hasAppointment = (date: Date) => {
    const dateKey = formatDateKey(date);
    return appointments.some(a => a.date === dateKey);
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return appointments.filter(a => a.date === dateKey);
  };

  const getPublicLink = () => {
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#/schedule/${username}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getPublicLink());
    alert('Link copiado! Agora é só mandar pra cliente.');
  };

  const handleToggleGoogle = () => {
     if (googleSync) {
         setGoogleSync(false);
     } else {
         setIsSyncing(true);
         setTimeout(() => {
             setIsSyncing(false);
             setGoogleSync(true);
         }, 1500);
     }
  };

  const handleSaveSettings = () => {
    if (!isPremium) return;
    
    updatePublicProfile({
      username,
      bio: tempBio,
      policies: tempPolicies,
      workingHours,
      services: myServices,
      googleSyncEnabled: googleSync
    });
    alert('Tudo salvo com sucesso!');
  };

  const toggleWorkingDay = (dayIndex: number) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], isOpen: !prev[dayIndex].isOpen }
    }));
  };

  const updateWorkingTime = (dayIndex: number, field: 'start' | 'end', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], [field]: value }
    }));
  };

  const calendarDays = generateCalendarDays();
  const selectedDayAppointments = getAppointmentsForDate(selectedDate);
  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="flex flex-col h-full animate-fade-in pb-8 relative">
      
      {/* Tabs Header */}
      <div className="flex items-center gap-4 mb-6 border-b border-stone-200 dark:border-stone-700 pb-1">
        <button 
           onClick={() => setActiveTab('calendar')}
           className={`pb-3 px-2 font-medium text-sm transition-colors ${activeTab === 'calendar' ? 'border-b-2 border-stone-800 dark:border-gold-500 text-stone-800 dark:text-stone-100' : 'text-stone-400 hover:text-stone-600'}`}
        >
           Agenda
        </button>
        <button 
           onClick={() => setActiveTab('settings')}
           className={`pb-3 px-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-b-2 border-stone-800 dark:border-gold-500 text-stone-800 dark:text-stone-100' : 'text-stone-400 hover:text-stone-600'}`}
        >
           Configurar Link {activeTab !== 'settings' && !isPremium && <Lock size={12}/>}
        </button>
      </div>

      {activeTab === 'calendar' && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar View */}
          <div className="lg:w-2/3 flex flex-col bg-white dark:bg-stone-800 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
               <h2 className="text-2xl font-display dark:text-stone-100 capitalize flex items-center gap-2">
                 <CalendarIcon className="text-gold-500" size={24} />
                 {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
               </h2>
               <div className="flex gap-2">
                 <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-stone-700 rounded-full text-stone-600 dark:text-stone-300 transition-all"><ChevronLeft size={24} /></button>
                 <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-stone-700 rounded-full text-stone-600 dark:text-stone-300 transition-all"><ChevronRight size={24} /></button>
               </div>
            </div>

            <div className="p-6">
               <div className="grid grid-cols-7 mb-4">
                 {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                   <div key={d} className="text-center text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">{d}</div>
                 ))}
               </div>
               <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, idx) => {
                    if (!day) return <div key={idx} className="p-2 min-h-[80px]"></div>;
                    const isToday = new Date().toDateString() === day.toDateString();
                    const isSel = isSelected(day);
                    const hasAppt = hasAppointment(day);

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative p-2 rounded-2xl flex flex-col items-center justify-start transition-all min-h-[80px] group
                          ${isSel ? 'bg-stone-800 dark:bg-gold-500 text-white dark:text-stone-900 shadow-lg scale-105 z-10' : 'hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-700/50'}
                          ${isToday && !isSel ? 'ring-2 ring-gold-400 dark:ring-gold-500 ring-inset' : ''}
                        `}
                      >
                        <span className="text-lg font-medium">{day.getDate()}</span>
                        {hasAppt && (
                           <div className={`mt-auto mb-2 w-1.5 h-1.5 rounded-full ${isSel ? 'bg-white' : 'bg-gold-500'}`}></div>
                        )}
                      </button>
                    );
                  })}
               </div>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="lg:w-1/3 flex flex-col space-y-6">
             <div className="bg-stone-900 dark:bg-stone-700 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl"></div>
                <div>
                  <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">Agenda do Dia</p>
                  <h3 className="text-4xl font-display">{selectedDate.getDate()}</h3>
                  <p className="text-stone-300 text-lg capitalize">{selectedDate.toLocaleString('pt-BR', { month: 'long', weekday: 'long' })}</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="w-full mt-6 bg-gold-500 hover:bg-gold-600 text-white p-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    {showForm ? 'Cancelar' : <><Plus size={20} /> Marcar Cliente</>}
                </button>
             </div>

             {showForm && (
               <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-lg border border-gold-200 animate-fade-in">
                  <h4 className="font-medium mb-4 dark:text-stone-100 flex items-center gap-2"><Clock size={18}/> Novo Horário</h4>
                  <div className="space-y-4">
                     <input 
                       placeholder="Nome da Cliente" 
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                       value={newClient} onChange={e => setNewClient(e.target.value)}
                     />
                     <input 
                       placeholder="Telefone (opcional)" 
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                       value={newPhone} onChange={e => setNewPhone(e.target.value)}
                     />
                     <select 
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                       value={newService} onChange={e => setNewService(e.target.value)}
                     >
                        <option value="">Qual trança?</option>
                        {myServices.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                     </select>
                     <input 
                       type="time"
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                       value={newTime} onChange={e => setNewTime(e.target.value)}
                     />
                     <button onClick={saveAppointment} className="w-full py-3 bg-stone-800 dark:bg-gold-500 text-white dark:text-stone-900 rounded-xl font-bold">Confirmar</button>
                  </div>
               </div>
             )}

             <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 px-2">Horários Marcados</h4>
                {selectedDayAppointments.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-3xl border border-dashed border-stone-200 dark:border-stone-700">
                     <p className="text-sm text-stone-500">Nenhum agendamento.</p>
                  </div>
                ) : (
                  selectedDayAppointments.map(appt => (
                    <div key={appt.id} className="bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 relative group">
                       <div className="flex items-center gap-3">
                          <div className="bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 px-3 py-2 rounded-lg font-bold text-lg">{appt.time}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-stone-800 dark:text-stone-100">{appt.clientName}</h4>
                            <span className="text-xs text-stone-500 dark:text-stone-400">{appt.service}</span>
                          </div>
                          {appt.origin === 'public_link' && <div className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">Online</div>}
                       </div>
                       <button onClick={() => deleteAppt(appt.id)} className="absolute top-4 right-4 text-stone-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
           {/* Premium Lock Overlay */}
           {!isPremium && (
             <div className="bg-stone-900 text-white p-8 rounded-3xl text-center relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <Lock size={48} className="mx-auto mb-4 text-gold-400" />
                <h2 className="text-2xl font-display mb-2">Isso é Premium</h2>
                <p className="text-stone-300 max-w-lg mx-auto mb-6">O agendamento automático online e a sincronização com Google Agenda são só pra quem assina o Premium.</p>
                <button onClick={() => navigate('/plans')} className="bg-gold-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-gold-600">
                   Quero ser Premium
                </button>
             </div>
           )}

           <div className={`space-y-6 ${!isPremium ? 'opacity-50 pointer-events-none filter blur-sm select-none' : ''}`}>
             
             {/* Public Link Section */}
             <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-medium dark:text-stone-100 flex items-center gap-2"><LinkIcon size={20} className="text-gold-500"/> Seu Link de Agendamento</h3>
                   <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">ATIVO</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-center bg-stone-50 dark:bg-stone-700/50 p-4 rounded-xl border border-stone-200 dark:border-stone-600 mb-6">
                   <div className="flex-1 font-mono text-sm text-stone-600 dark:text-stone-300 break-all">
                      {getPublicLink()}
                   </div>
                   <div className="flex gap-2">
                      <button onClick={copyLink} className="p-2 text-stone-500 hover:text-gold-500 bg-white dark:bg-stone-600 rounded-lg border border-stone-200 dark:border-stone-500"><Copy size={18}/></button>
                      <a href={getPublicLink()} target="_blank" className="p-2 text-stone-500 hover:text-gold-500 bg-white dark:bg-stone-600 rounded-lg border border-stone-200 dark:border-stone-500"><ExternalLink size={18}/></a>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-stone-400 uppercase mb-1">Nome de Usuário (@link)</label>
                     <input 
                       value={username}
                       onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 outline-none focus:border-gold-500"
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-stone-400 uppercase mb-1">Bio Profissional</label>
                     <input 
                       value={tempBio}
                       onChange={e => setTempBio(e.target.value)}
                       placeholder="Uma frase curta sobre seu trabalho"
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 outline-none focus:border-gold-500"
                     />
                   </div>
                   <div className="col-span-2">
                     <label className="text-xs font-bold text-stone-400 uppercase mb-1">Regras de Agendamento</label>
                     <textarea 
                       value={tempPolicies}
                       onChange={e => setTempPolicies(e.target.value)}
                       placeholder="Ex: Tolerância de 15min. Avisar se for atrasar."
                       className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 outline-none focus:border-gold-500"
                       rows={2}
                     />
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200 flex items-center gap-2">
                               <RefreshCw size={16} className={googleSync ? "text-green-500" : "text-stone-400"} />
                               Sincronizar com Google Agenda
                            </h4>
                            <p className="text-xs text-stone-500">Bloqueia automaticamente horários ocupados no seu Google.</p>
                        </div>
                        <button 
                            onClick={handleToggleGoogle}
                            disabled={isSyncing}
                            className={`w-12 h-6 rounded-full transition-colors relative ${googleSync ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-600'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${googleSync ? 'translate-x-6' : 'translate-x-0'}`}>
                                {isSyncing && <Loader2 size={12} className="animate-spin text-stone-500 m-0.5"/>}
                            </div>
                        </button>
                    </div>
                </div>
             </div>

             {/* Services Configuration Section */}
             <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-medium dark:text-stone-100 flex items-center gap-2">
                      <Settings size={20} className="text-gold-500"/> Meus Serviços
                   </h3>
                   <button 
                      onClick={() => openServiceModal()}
                      className="flex items-center gap-2 bg-stone-900 dark:bg-stone-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors"
                   >
                      <Plus size={16}/> Adicionar
                   </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {myServices.map((service) => (
                        <div key={service.id} className="flex justify-between items-center p-4 bg-stone-50 dark:bg-stone-700/30 rounded-xl border border-stone-100 dark:border-stone-700/50 hover:border-gold-300 transition-colors group">
                            <div className="flex items-center gap-4">
                                {service.image ? (
                                    <img src={service.image} alt={service.name} className="w-12 h-12 rounded-lg object-cover border border-stone-200 dark:border-stone-600" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-stone-200 dark:bg-stone-600 flex items-center justify-center text-stone-400">
                                        <ImageIcon size={20} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-bold text-stone-800 dark:text-stone-200">{service.name}</h4>
                                    <div className="flex gap-3 text-xs text-stone-500 mt-1">
                                        <span className="flex items-center gap-1"><Clock size={10}/> {service.avgTime}h</span>
                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><DollarSign size={10}/> R$ {service.price}</span>
                                    </div>
                                    {service.materialReq && (
                                        <p className="text-xs text-stone-400 mt-1 flex items-center gap-1"><Package size={10}/> {service.materialReq}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openServiceModal(service)} className="p-2 text-stone-400 hover:text-gold-500 bg-white dark:bg-stone-600 rounded-lg shadow-sm"><Edit2 size={16}/></button>
                                <button onClick={() => handleDeleteService(service.id)} className="p-2 text-stone-400 hover:text-red-500 bg-white dark:bg-stone-600 rounded-lg shadow-sm"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Working Hours Section */}
             <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
                <h3 className="text-lg font-medium dark:text-stone-100 mb-6 flex items-center gap-2"><Clock size={20} className="text-gold-500"/> Horário de Atendimento</h3>
                <div className="space-y-3">
                   {weekDays.map((day, idx) => {
                      const dayConfig = workingHours[idx] || { isOpen: false, start: '09:00', end: '18:00' };
                      return (
                        <div key={idx} className="flex items-center gap-4 py-2 border-b border-stone-50 dark:border-stone-700 last:border-0">
                           <div className="w-24 font-medium text-stone-600 dark:text-stone-300">{day}</div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={dayConfig.isOpen} onChange={() => toggleWorkingDay(idx)} />
                              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                           </label>
                           {dayConfig.isOpen ? (
                             <div className="flex gap-2 items-center flex-1 justify-end">
                                <input type="time" value={dayConfig.start} onChange={e => updateWorkingTime(idx, 'start', e.target.value)} className="p-1 rounded bg-stone-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-sm" />
                                <span className="text-stone-400">-</span>
                                <input type="time" value={dayConfig.end} onChange={e => updateWorkingTime(idx, 'end', e.target.value)} className="p-1 rounded bg-stone-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-sm" />
                             </div>
                           ) : (
                             <div className="flex-1 text-right text-stone-400 text-sm italic">Fechado</div>
                           )}
                        </div>
                      );
                   })}
                </div>
             </div>

             <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSaveSettings}
                  className="bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Check size={20} /> Salvar Configurações
                </button>
             </div>
           </div>
        </div>
      )}

      {/* Modal for Service Editing */}
      {showServiceModal && editingService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-stone-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in border border-stone-200 dark:border-stone-700">
                  <h3 className="text-xl font-bold mb-4 dark:text-stone-100">
                      {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
                  </h3>
                  
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div>
                          <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Nome da Trança</label>
                          <input 
                              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                              value={editingService.name}
                              onChange={e => setEditingService({...editingService, name: e.target.value})}
                              placeholder="Ex: Box Braids"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Foto do Penteado</label>
                          <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center relative hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                              {editingService.image ? (
                                  <div className="relative inline-block">
                                      <img src={editingService.image} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-sm mx-auto" />
                                      <button 
                                          onClick={() => setEditingService({...editingService, image: ''})}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                                      >
                                          <X size={14} />
                                      </button>
                                  </div>
                              ) : (
                                  <div className="flex flex-col items-center justify-center py-4 text-stone-400 cursor-pointer">
                                      <Upload size={24} className="mb-2" />
                                      <span className="text-sm">Bota uma foto bem linda aqui</span>
                                      <input 
                                          type="file" 
                                          accept="image/*"
                                          onChange={handleImageUpload}
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                      />
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Preço (R$)</label>
                            <input 
                                type="number"
                                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                                value={editingService.price}
                                onChange={e => setEditingService({...editingService, price: Number(e.target.value)})}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Tempo (Horas)</label>
                            <input 
                                type="number" step="0.5"
                                className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                                value={editingService.avgTime}
                                onChange={e => setEditingService({...editingService, avgTime: Number(e.target.value)})}
                            />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Materiais Necessários</label>
                          <textarea 
                              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                              value={editingService.materialReq}
                              onChange={e => setEditingService({...editingService, materialReq: e.target.value})}
                              placeholder="Ex: 2 pacotes de jumbo. A cliente precisa saber."
                              rows={2}
                          />
                          <p className="text-[10px] text-stone-400 mt-1">Isso aparece pra cliente na calculadora.</p>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Explica como é</label>
                          <textarea 
                              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 outline-none"
                              value={editingService.description}
                              onChange={e => setEditingService({...editingService, description: e.target.value})}
                              placeholder="Detalhes sobre a técnica..."
                              rows={3}
                          />
                      </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                      <button 
                          onClick={() => setShowServiceModal(false)}
                          className="flex-1 py-3 border border-stone-200 dark:border-stone-600 rounded-xl text-stone-500 font-medium hover:bg-stone-50 dark:hover:bg-stone-700"
                      >
                          Cancelar
                      </button>
                      <button 
                          onClick={() => handleSaveService(editingService)}
                          disabled={!editingService.name}
                          className="flex-1 py-3 bg-stone-800 dark:bg-gold-500 text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
                      >
                          Salvar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Agenda;
