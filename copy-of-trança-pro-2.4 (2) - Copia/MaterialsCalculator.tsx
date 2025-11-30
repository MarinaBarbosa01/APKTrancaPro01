import React, { useState } from 'react';
import { DEFAULT_BRAID_CATALOG } from '../types';
import { AlertCircle, Search, Info } from 'lucide-react';

const MaterialsCalculator = () => {
  const [selectedId, setSelectedId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBraids = DEFAULT_BRAID_CATALOG.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedService = DEFAULT_BRAID_CATALOG.find(b => b.id === selectedId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-light dark:text-stone-100">Calculadora de Materiais</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm">Saiba exatamente o que comprar para cada modelo.</p>
      </div>
      
      <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
         <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">Qual trança você vai fazer?</label>
         
         {/* Search Box */}
         <div className="relative mb-3">
            <Search className="absolute left-3 top-3.5 text-stone-400" size={18}/>
            <input 
              className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-gold-500 mb-2"
              placeholder="Pesquisar (ex: Goddess, Nagô...)"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setSelectedId(''); }}
            />
         </div>

         <select 
            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-gold-500"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            size={filteredBraids.length > 5 ? 5 : 0} // Show list if searching
         >
           <option value="">{searchTerm ? 'Selecione na lista...' : 'Selecione um modelo...'}</option>
           {filteredBraids.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
         </select>
      </div>

      {selectedService && (
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 dark:from-gold-600 dark:to-amber-700 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden animate-fade-in">
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
           
           <h3 className="font-display text-2xl mb-1">{selectedService.name}</h3>
           <p className="text-stone-300 dark:text-stone-100 text-xs mb-6 opacity-80 uppercase tracking-widest">Lista de Materiais</p>
           
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <p className="text-xl font-medium leading-relaxed">
                {selectedService.materialReq || "Material não especificado."}
              </p>
           </div>
           
           <div className="mt-6 flex gap-3 items-start text-xs text-stone-300 dark:text-stone-100 opacity-80">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>Essa quantidade é uma média padrão. Pode variar de acordo com a densidade do cabelo da cliente, comprimento desejado e espessura das tranças.</p>
           </div>
        </div>
      )}

      {!selectedService && (
        <div className="text-center py-10 opacity-50">
           <AlertCircle size={48} className="mx-auto mb-2 text-stone-300"/>
           <p className="text-stone-400 text-sm">Selecione um serviço acima para ver a lista.</p>
        </div>
      )}
    </div>
  );
};

export default MaterialsCalculator;