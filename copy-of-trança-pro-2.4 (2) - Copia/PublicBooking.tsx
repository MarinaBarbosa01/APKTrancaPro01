
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Appointment, BraidService, PublicProfileSettings, DEFAULT_BRAID_CATALOG } from '../types';
import { Clock, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Package, MessageCircle } from 'lucide-react';

// Mock data fetcher since we don't have a backend to fetch by username
const getPublicProfileByUsername = (username: string): PublicProfileSettings | null => {
   if (!username) return null;
   
   // Try to get from local storage (Current User)
   const saved = localStorage.getItem('trancaProUser');
   if (saved) {
     try {
        const user = JSON.parse(saved);
        // Normalize comparison
        if (user?.publicProfile?.username?.toLowerCase() === username.toLowerCase()) {
            return user.publicProfile;
        }
     } catch (e) {
        console.error("Error parsing user", e);
     }
   }
   
   // Fallback Demo User
   if (username === 'demo' || username === 'trancistapro') {
     return {
       username: 'trancistapro',
       bio: 'Especialista em Box Braids e Nagô. Transformando autoestima.',
       whatsapp: '11999999999',
       policies: 'Atraso de 15 min. Sinal de 30% para reservar.',
       workingHours: {
          1: { isOpen: true, start: "09:00", end: "18:00" },
          2: { isOpen: true, start: "09:00", end: "18:00" },
          3: { isOpen: true, start: "09:00", end: "18:00" },
          4: { isOpen: true, start: "09:00", end: "18:00" },
          5: { isOpen: true, start: "09:00", end: "18:00" },
       },
       services: DEFAULT_BRAID_CATALOG,
       googleSyncEnabled: false
     }
   }
   return null;
};

const PublicBooking = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<PublicProfileSettings | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Booking Data
  const [selectedService, setSelectedService] = useState<BraidService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', notes: '' });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    const timer = setTimeout(() => {
       if (username) {
         const data = getPublicProfileByUsername(username);
         if (data) {
            // Ensure services array exists
            if (!data.services) data.services = DEFAULT_BRAID_CATALOG;
            setProfile(data);
         } else {
            setError(true);
         }
       } else {
         setError(true);
       }
       setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [username]);

  // Generate Slots Logic
  useEffect(() => {
    if (selectedDate && profile && selectedService) {
       const dayIndex = selectedDate.getDay();
       const dayConfig = profile.workingHours[dayIndex];
       
       if (!dayConfig || !dayConfig.isOpen) {
         setAvailableSlots([]);
         return;
       }

       const slots = [];
       // Safe parsing ensuring we have defaults
       let startStr = dayConfig.start || "09:00";
       let endStr = dayConfig.end || "18:00";
       
       let currentHour = parseInt(startStr.split(':')[0]);
       const endHour = parseInt(endStr.split(':')[0]);

       // Mock existing appointments blocking
       const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
       const dateKey = selectedDate.toISOString().split('T')[0];
       const dayApps = appointments.filter((a: Appointment) => a.date === dateKey);
       const blockedTimes = dayApps.map((a: Appointment) => a.time.split(':')[0]); 

       while (currentHour < endHour) {
          const timeStr = `${currentHour.toString().padStart(2, '0')}:00`;
          if (!blockedTimes.includes(currentHour.toString().padStart(2, '0'))) {
             slots.push(timeStr);
          }
          currentHour++; 
       }
       setAvailableSlots(slots);
    }
  }, [selectedDate, profile, selectedService]);

  const handleConfirm = () => {
     if (!selectedDate || !selectedTime || !selectedService) return;

     const appt: Appointment = {
        id: Date.now().toString(),
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        service: selectedService.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'confirmed',
        origin: 'public_link',
        createdAt: new Date().toISOString(),
        notes: clientInfo.notes
     };

     const currentApps = JSON.parse(localStorage.getItem('appointments') || '[]');
     localStorage.setItem('appointments', JSON.stringify([...currentApps, appt]));
     
     setBookedSuccess(true);
  };

  if (loading) {
     return (
        <div className="h-screen flex items-center justify-center bg-stone-50">
            <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full"></div>
        </div>
     );
  }

  if (error || !profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
         <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-4">
             <AlertCircle size={32} className="text-stone-400"/>
         </div>
         <h1 className="text-xl font-display text-stone-800 mb-2">Link não encontrado</h1>
         <p className="text-stone-500 max-w-xs mx-auto">Verifique se o endereço está correto ou entre em contato com a trancista.</p>
      </div>
    );
  }

  // Double safety check
  const profileServices = (profile.services && profile.services.length > 0) ? profile.services : DEFAULT_BRAID_CATALOG;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-10">
      {/* Header Profile */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
         <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center font-display text-xl font-bold shrink-0">
               {profile.username ? profile.username.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="min-w-0">
               <h1 className="font-bold text-lg leading-tight truncate">@{profile.username}</h1>
               <p className="text-xs text-stone-500 line-clamp-1">{profile.bio || 'Agendamento Online'}</p>
            </div>
         </div>
         {/* Progress Bar */}
         <div className="h-1 bg-stone-100 w-full">
            <div className="h-full bg-gold-500 transition-all duration-300" style={{width: bookedSuccess ? '100%' : `${step * 25}%`}}></div>
         </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-8">
        {bookedSuccess ? (
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-display mb-2">Agendado!</h2>
              <p className="text-stone-500 mb-6">Seu horário tá garantido.</p>
              
              <div className="bg-stone-50 p-4 rounded-xl text-left mb-6">
                 <div className="flex justify-between border-b border-stone-200 pb-2 mb-2">
                    <span className="text-stone-500 text-sm">Serviço</span>
                    <span className="font-medium text-right">{selectedService?.name}</span>
                 </div>
                 <div className="flex justify-between border-b border-stone-200 pb-2 mb-2">
                    <span className="text-stone-500 text-sm">Data</span>
                    <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-stone-500 text-sm">Horário</span>
                    <span className="font-medium">{selectedTime}</span>
                 </div>
              </div>

              <p className="text-xs text-stone-400 mb-6">{profile.policies}</p>

              <button className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                 <MessageCircle size={18} /> Mandar Comprovante no Zap
              </button>
           </div>
        ) : (
           <>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                 <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-light mb-4">Escolha o visual</h2>
                    {profileServices.map((service) => (
                       <button 
                         key={service.id}
                         onClick={() => { setSelectedService(service); setStep(2); }}
                         className="w-full bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-left hover:border-gold-400 transition-all flex justify-between items-center group active:scale-[0.98]"
                       >
                          <div className="flex gap-4 items-center w-full min-w-0">
                             {service.image ? (
                                <img src={service.image} alt={service.name} className="w-16 h-16 rounded-xl object-cover border border-stone-100 shrink-0 bg-stone-200" />
                             ) : (
                                <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-300">
                                   <Package size={24}/>
                                </div>
                             )}
                             <div className="flex-1 min-w-0">
                                 <h3 className="font-bold text-stone-800 text-lg truncate">{service.name}</h3>
                                 <p className="text-sm text-stone-500 mt-1 line-clamp-1">{service.description || 'Sem descrição.'}</p>
                                 <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium text-stone-400">
                                    <span className="flex items-center gap-1"><Clock size={12}/> {service.avgTime}h</span>
                                    <span className="text-gold-600 text-sm font-bold">R$ {service.price}</span>
                                 </div>
                             </div>
                          </div>
                          <ChevronRight className="text-stone-300 group-hover:text-gold-500 shrink-0 ml-2"/>
                       </button>
                    ))}
                 </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                       <button onClick={() => setStep(1)} className="p-2 -ml-2 text-stone-400 hover:text-stone-600"><ChevronLeft/></button>
                       <h2 className="text-2xl font-light">Quando você vem?</h2>
                    </div>

                    {/* Date Picker (Simplified) */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
                       <h3 className="text-sm font-bold text-stone-400 uppercase mb-3">Próximos Dias</h3>
                       <div className="flex gap-3">
                          {[0,1,2,3,4,5,6].map(offset => {
                             const d = new Date();
                             d.setDate(d.getDate() + offset);
                             const isSel = selectedDate?.toDateString() === d.toDateString();
                             return (
                                <button 
                                  key={offset}
                                  onClick={() => { setSelectedDate(d); setSelectedTime(''); }}
                                  className={`min-w-[70px] p-3 rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 border-stone-100 text-stone-600 hover:bg-stone-100'}`}
                                >
                                   <span className="text-xs uppercase">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).replace('.', '')}</span>
                                   <span className="text-lg font-bold">{d.getDate()}</span>
                                </button>
                             )
                          })}
                       </div>
                    </div>

                    {/* Slots */}
                    {selectedDate && (
                       <div className="animate-fade-in">
                          <h3 className="text-sm font-bold text-stone-400 uppercase mb-3">Horários Livres</h3>
                          {availableSlots.length > 0 ? (
                             <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map(time => (
                                   <button 
                                     key={time}
                                     onClick={() => setSelectedTime(time)}
                                     className={`py-3 rounded-xl border font-medium text-sm transition-all ${selectedTime === time ? 'bg-gold-500 text-white border-gold-500' : 'bg-white border-stone-200 text-stone-600 hover:border-gold-300'}`}
                                   >
                                      {time}
                                   </button>
                                ))}
                             </div>
                          ) : (
                             <div className="text-center p-6 bg-stone-100 rounded-xl text-stone-500 border border-dashed border-stone-200">
                                Poxa, sem horário livre nesse dia. Tenta outro?
                             </div>
                          )}
                       </div>
                    )}

                    <button 
                       disabled={!selectedDate || !selectedTime}
                       onClick={() => setStep(3)}
                       className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold disabled:opacity-50 mt-4 shadow-lg hover:bg-black transition-all"
                    >
                       Continuar
                    </button>
                 </div>
              )}

              {/* Step 3: Info */}
              {step === 3 && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                       <button onClick={() => setStep(2)} className="p-2 -ml-2 text-stone-400 hover:text-stone-600"><ChevronLeft/></button>
                       <h2 className="text-2xl font-light">Seus Dados</h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                       <div>
                          <label className="text-xs font-bold text-stone-400 uppercase mb-1">Nome Completo</label>
                          <input 
                            value={clientInfo.name}
                            onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                            className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-gold-500 text-stone-800"
                            placeholder="Como você gosta de ser chamada?"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-stone-400 uppercase mb-1">WhatsApp / Telefone</label>
                          <input 
                            value={clientInfo.phone}
                            onChange={e => setClientInfo({...clientInfo, phone: e.target.value})}
                            className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-gold-500 text-stone-800"
                            placeholder="(00) 00000-0000"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-stone-400 uppercase mb-1">Recadinho (Opcional)</label>
                          <textarea 
                            value={clientInfo.notes}
                            onChange={e => setClientInfo({...clientInfo, notes: e.target.value})}
                            className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:border-gold-500 text-stone-800 resize-none"
                            placeholder="Alguma alergia? Cor específica?"
                            rows={2}
                          />
                       </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm">
                       <strong className="block mb-1">Regrinhas:</strong>
                       {profile.policies || "Chegue no horário, por favor! Tolerância de 15 minutos."}
                    </div>

                    <button 
                       disabled={!clientInfo.name || !clientInfo.phone}
                       onClick={handleConfirm}
                       className="w-full bg-gold-500 text-white py-4 rounded-xl font-bold disabled:opacity-50 shadow-lg hover:bg-gold-600 transition-all"
                    >
                       Confirmar Agendamento
                    </button>
                 </div>
              )}
           </>
        )}
      </div>
    </div>
  );
};

export default PublicBooking;
