import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_BRAID_CATALOG } from '../types';
import { RefreshCw, DollarSign, Clock, Save, ArrowRight } from 'lucide-react';

const PricingCalculator = () => {
  const [regionLevel, setRegionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedService, setSelectedService] = useState('');
  const [time, setTime] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [location, setLocation] = useState<'studio' | 'home'>('studio');
  const [history, setHistory] = useState<any[]>([]);

  // Constants
  const HOURLY_RATE_BASE = 25; // Base hourly wage goal
  const HOME_VISIT_FEE = 30;
  
  const regionMultipliers = {
    low: 0.8,
    medium: 1.0,
    high: 1.4
  };

  const regionRanges = {
    low: "R$ 150-300",
    medium: "R$ 250-450",
    high: "R$ 400-800"
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('pricingHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedService(name);
    const service = DEFAULT_BRAID_CATALOG.find(s => s.name === name);
    if (service) {
      setTime(service.avgTime);
      
      // Estimate material cost based on description since it is not in the type definition
      let estimatedCost = 0;
      if (service.materialReq) {
          // Attempt to extract number of packs
          const match = service.materialReq.match(/(\d+)/);
          if (match) {
             estimatedCost = parseInt(match[0]) * 30; // Approx R$30 per pack
          } else if (service.materialReq.toLowerCase().includes('não usa')) {
             estimatedCost = 5; // Consumables
          } else {
             estimatedCost = 25; // Default fallback
          }
      }
      setMaterialCost(estimatedCost);
    }
  };

  // Memoized calculation for display only - DOES NOT cause side effects
  const results = useMemo(() => {
    if (!selectedService) return null;

    const laborCost = time * HOURLY_RATE_BASE;
    const baseTotal = laborCost + materialCost + (location === 'home' ? HOME_VISIT_FEE : 0);
    
    // Applying regional multiplier
    const regionalAdjustment = (laborCost * regionMultipliers[regionLevel]) - laborCost;
    
    const minPrice = baseTotal + regionalAdjustment;
    const recPrice = minPrice * 1.2; // 20% margin
    const premPrice = minPrice * 1.5; // 50% margin
    
    const profit = recPrice - materialCost - (location === 'home' ? 10 : 0); // Simplified expense deduction

    return { minPrice, recPrice, premPrice, laborCost, regionalAdjustment, profit };
  }, [selectedService, time, materialCost, location, regionLevel]);

  const handleSaveHistory = () => {
    if (!results || !selectedService) return;

    const entry = {
      date: new Date().toLocaleDateString(),
      service: selectedService,
      min: results.minPrice,
      rec: results.recPrice,
      prem: results.premPrice,
      profit: results.profit
    };

    const newHistory = [entry, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('pricingHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-light dark:text-stone-100">Calculadora de Preços</h2>
        <div className="bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-stone-200 dark:border-stone-700">
           <span className="text-stone-500 dark:text-stone-400">Região:</span>
           <span className="font-semibold capitalize text-stone-800 dark:text-stone-200">{regionLevel} ({regionRanges[regionLevel]})</span>
           <button onClick={() => setRegionLevel(prev => prev === 'low' ? 'medium' : prev === 'medium' ? 'high' : 'low')} className="ml-2 text-amber-600 dark:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-full p-1">
             <RefreshCw size={14} />
           </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tipo de Serviço</label>
            <select 
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              value={selectedService}
              onChange={handleServiceChange}
            >
              <option value="">Selecione uma trança...</option>
              {DEFAULT_BRAID_CATALOG.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tempo (horas)</label>
               <div className="relative">
                 <Clock size={16} className="absolute left-3 top-3.5 text-stone-400" />
                 <input 
                    type="number" 
                    value={time} 
                    onChange={e => setTime(Number(e.target.value))}
                    className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-amber-500 transition-colors"
                 />
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Custo Material (R$)</label>
               <div className="relative">
                 <DollarSign size={16} className="absolute left-3 top-3.5 text-stone-400" />
                 <input 
                    type="number" 
                    value={materialCost} 
                    onChange={e => setMaterialCost(Number(e.target.value))}
                    className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-amber-500 transition-colors"
                 />
               </div>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Local do Atendimento</label>
             <div className="flex gap-3">
               <button 
                  onClick={() => setLocation('studio')}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all font-medium ${location === 'studio' ? 'bg-stone-800 text-white dark:bg-gold-500 dark:text-stone-900 border-transparent shadow-md' : 'border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 dark:text-stone-300'}`}
               >
                 Salão
               </button>
               <button 
                  onClick={() => setLocation('home')}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all font-medium ${location === 'home' ? 'bg-stone-800 text-white dark:bg-gold-500 dark:text-stone-900 border-transparent shadow-md' : 'border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 dark:text-stone-300'}`}
               >
                 Domicílio
               </button>
             </div>
          </div>
        </div>

        {results ? (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-stone-900 dark:bg-stone-700 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden border border-stone-700">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <p className="text-gold-400 text-sm font-bold uppercase tracking-wider mb-2">Sugestão de Preço</p>
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-2xl font-light opacity-70">R$</span>
                    <span className="text-6xl font-display">{results.recPrice.toFixed(0)}</span>
                    <span className="text-2xl font-light opacity-70">,00</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm border-t border-white/10 pt-6">
                   <div>
                      <span className="block text-stone-400 text-xs mb-1">Mínimo</span>
                      <span className="font-medium text-lg">R$ {results.minPrice.toFixed(0)}</span>
                   </div>
                   <div>
                      <span className="block text-stone-400 text-xs mb-1">Premium</span>
                      <span className="font-medium text-lg">R$ {results.premPrice.toFixed(0)}</span>
                   </div>
                   <div>
                      <span className="block text-emerald-400 text-xs mb-1">Seu Lucro</span>
                      <span className="font-medium text-lg text-emerald-400">R$ {results.profit.toFixed(0)}</span>
                   </div>
                </div>
             </div>

             <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-sm">
                <ul className="space-y-3 text-sm text-stone-600 dark:text-stone-400">
                   <li className="flex justify-between border-b border-stone-100 dark:border-stone-700/50 pb-2">
                     <span>Mão de obra ({time}h)</span>
                     <span>R$ {results.laborCost.toFixed(2)}</span>
                   </li>
                   <li className="flex justify-between border-b border-stone-100 dark:border-stone-700/50 pb-2">
                     <span>Materiais</span>
                     <span>R$ {materialCost.toFixed(2)}</span>
                   </li>
                   {location === 'home' && (
                     <li className="flex justify-between border-b border-stone-100 dark:border-stone-700/50 pb-2">
                        <span>Taxa de Deslocamento</span>
                        <span>R$ {HOME_VISIT_FEE.toFixed(2)}</span>
                     </li>
                   )}
                   <li className="flex justify-between text-gold-600 dark:text-gold-400 font-medium pt-1">
                     <span>Ajuste Regional ({regionLevel})</span>
                     <span>+ R$ {results.regionalAdjustment.toFixed(2)}</span>
                   </li>
                </ul>
                
                <button 
                  onClick={handleSaveHistory}
                  className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-gold-400 hover:text-gold-500 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Save size={18} /> Salvar no Histórico
                </button>
             </div>
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-full bg-stone-50 dark:bg-stone-800/50 rounded-3xl border border-stone-200 dark:border-stone-700 text-stone-400 p-8 text-center">
              <ArrowRight size={48} className="mb-4 opacity-20" />
              <p>Selecione um serviço para ver a sugestão de preço.</p>
           </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 dark:text-stone-200">Histórico Recente</h3>
        <div className="overflow-x-auto rounded-2xl border border-stone-100 dark:border-stone-700">
          <table className="w-full text-sm text-left text-stone-600 dark:text-stone-400">
            <thead className="text-xs uppercase bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-300 font-bold">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Valor Sugerido</th>
                <th className="px-6 py-4 text-right">Lucro Previsto</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-stone-800">
              {history.map((h, i) => (
                <tr key={i} className="border-b border-stone-100 dark:border-stone-700 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                  <td className="px-6 py-4">{h.date}</td>
                  <td className="px-6 py-4 font-medium text-stone-800 dark:text-stone-200">{h.service}</td>
                  <td className="px-6 py-4 text-stone-800 dark:text-stone-200">R$ {h.rec.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">R$ {h.profit.toFixed(2)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                    Nenhum cálculo salvo ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;