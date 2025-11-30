
import React, { useState } from 'react';
import { Check, ChevronRight, Award, Target, User, Share2, Star } from 'lucide-react';

const ProfessionalScan = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    skills: [] as string[],
    experience: '',
    goal: '',
    profileType: ''
  });

  const toggleSkill = (name: string) => {
    if (data.skills.includes(name)) {
      setData({ ...data, skills: data.skills.filter(s => s !== name) });
    } else {
      setData({ ...data, skills: [...data.skills, name] });
    }
  };

  const calculateLevel = (skillsCount: number, exp: string) => {
     let points = skillsCount * 1; // 1 point per skill
     
     if (exp.includes('Menos')) points += 1;
     if (exp.includes('1 a 3')) points += 3;
     if (exp.includes('3 a 5')) points += 6;
     if (exp.includes('Mais')) points += 10;

     // 10 Levels based on points (Max approx 25-30) - Neutral Gender Language
     if (points <= 2) return "Nível Aspirante";
     if (points <= 5) return "Nível Aprendiz";
     if (points <= 8) return "Nível Iniciante";
     if (points <= 11) return "Nível Praticante";
     if (points <= 14) return "Nível Intermediário";
     if (points <= 17) return "Nível Avançado";
     if (points <= 20) return "Nível Profissional";
     if (points <= 23) return "Nível Master";
     if (points <= 26) return "Nível Especialista";
     return "Lenda das Tranças";
  };

  const handleFinish = () => {
    const type = calculateLevel(data.skills.length, data.experience);
    setData({ ...data, profileType: type });
    setStep(4);
  };

  const techniques = [
    'Box Braids', 'Knotless', 'Goddess', 'Nagô', 'Twists', 
    'Cornrows', 'Fulani', 'Ghana', 'Rope', 
    'Crochet', 'Entrelace', 'Penteados',
    'Locs Faux', 'Dread Wool', 'Gypsy', 'Butterfly'
  ];

  const renderStep1 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
         <h3 className="text-xl font-medium text-stone-800 dark:text-stone-200">Técnicas Dominadas</h3>
         <p className="text-stone-500 dark:text-stone-400 text-sm">Selecione o que você já sabe fazer</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {techniques.map(t => (
          <button 
            key={t}
            onClick={() => toggleSkill(t)}
            className={`p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
              data.skills.includes(t) 
                ? 'bg-stone-800 text-white border-stone-800 dark:bg-gold-500 dark:text-stone-900 dark:border-gold-500' 
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:border-gold-400'
            }`}
          >
            {t}
            {data.skills.includes(t) && <Check size={14} />}
          </button>
        ))}
      </div>
      <button 
        onClick={() => setStep(2)}
        disabled={data.skills.length === 0}
        className="w-full bg-stone-800 dark:bg-gold-500 text-white dark:text-stone-900 py-3 rounded-xl font-medium mt-6 disabled:opacity-50 flex justify-center items-center gap-2"
      >
        Próximo <ChevronRight size={18} />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
         <h3 className="text-xl font-medium text-stone-800 dark:text-stone-200">Tempo de Estrada</h3>
         <p className="text-stone-500 dark:text-stone-400 text-sm">Há quanto tempo você trança?</p>
      </div>
      <div className="space-y-3">
        {['Iniciante (Menos de 1 ano)', 'Intermediário (1 a 3 anos)', 'Experiente (3 a 5 anos)', 'Master (Mais de 5 anos)'].map((exp, idx) => {
           const val = exp.split(' (')[0];
           return (
            <button 
              key={idx}
              onClick={() => setData({ ...data, experience: exp })}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                data.experience === exp
                  ? 'bg-stone-800 text-white border-stone-800 dark:bg-gold-500 dark:text-stone-900 dark:border-gold-500' 
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {exp}
            </button>
           );
        })}
      </div>
      <div className="flex gap-3">
         <button onClick={() => setStep(1)} className="flex-1 py-3 text-stone-500 dark:text-stone-400">Voltar</button>
         <button 
          onClick={() => setStep(3)}
          disabled={!data.experience}
          className="flex-[2] bg-stone-800 dark:bg-gold-500 text-white dark:text-stone-900 py-3 rounded-xl font-medium disabled:opacity-50 flex justify-center items-center gap-2"
        >
          Próximo <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
         <h3 className="text-xl font-medium text-stone-800 dark:text-stone-200">Seu Objetivo Principal</h3>
         <p className="text-stone-500 dark:text-stone-400 text-sm">O que você busca com o app?</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {['Aumentar Faturamento', 'Organizar Agenda', 'Aprender Novas Técnicas', 'Marketing Digital'].map((goal) => (
           <button 
              key={goal}
              onClick={() => setData({ ...data, goal: goal })}
              className={`w-full p-4 rounded-xl border text-center transition-all ${
                data.goal === goal
                  ? 'bg-stone-800 text-white border-stone-800 dark:bg-gold-500 dark:text-stone-900 dark:border-gold-500' 
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {goal}
            </button>
        ))}
      </div>
      <div className="flex gap-3">
         <button onClick={() => setStep(2)} className="flex-1 py-3 text-stone-500 dark:text-stone-400">Voltar</button>
         <button 
          onClick={handleFinish}
          disabled={!data.goal}
          className="flex-[2] bg-gold-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 flex justify-center items-center gap-2"
        >
          Finalizar Análise
        </button>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="animate-fade-in">
       <div className="bg-stone-900 dark:bg-stone-800 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center border border-stone-700">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-600"></div>
           <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm relative">
              <Award size={48} className="text-gold-400" />
              <div className="absolute -bottom-2 -right-2 bg-gold-500 text-stone-900 text-[10px] font-bold px-2 py-1 rounded-full">
                 NV {data.skills.length}
              </div>
           </div>
           
           <h3 className="text-stone-400 text-sm uppercase tracking-widest mb-1">Seu Nível Atual</h3>
           <h2 className="text-3xl font-display text-gold-400 mb-6 px-4">{data.profileType}</h2>
           
           <div className="grid grid-cols-2 gap-4 text-left bg-white/5 rounded-xl p-4 mb-6">
              <div>
                 <span className="text-xs text-stone-400 block mb-1">Skills</span>
                 <span className="font-medium text-lg">{data.skills.length}</span>
              </div>
              <div>
                 <span className="text-xs text-stone-400 block mb-1">Foco</span>
                 <span className="font-medium text-sm line-clamp-1">{data.goal}</span>
              </div>
              <div className="col-span-2">
                 <span className="text-xs text-stone-400 block mb-1">Dominadas</span>
                 <div className="flex flex-wrap gap-1">
                    {data.skills.slice(0,4).map(s => <span key={s} className="text-[10px] bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded">{s}</span>)}
                    {data.skills.length > 4 && <span className="text-[10px] text-stone-500">+{data.skills.length - 4}</span>}
                 </div>
              </div>
           </div>

           <button className="w-full bg-white text-stone-900 font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-stone-100 transition-colors">
             <Share2 size={18} /> Compartilhar Conquista
           </button>
       </div>
       <div className="mt-6 text-center">
         <button onClick={() => { setStep(1); setData({skills: [], experience: '', goal: '', profileType: ''}) }} className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-sm">
           Refazer Análise
         </button>
       </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-6">
       {step < 4 && (
          <div className="flex justify-between items-center mb-8 px-4">
            <h2 className="text-xl font-light dark:text-stone-100">Scan Profissional</h2>
            <div className="flex gap-1">
              {[1,2,3].map(i => (
                <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-gold-500' : 'bg-stone-200 dark:bg-stone-700'}`}></div>
              ))}
            </div>
          </div>
       )}

       {step === 1 && renderStep1()}
       {step === 2 && renderStep2()}
       {step === 3 && renderStep3()}
       {step === 4 && renderResult()}
    </div>
  );
};

export default ProfessionalScan;
