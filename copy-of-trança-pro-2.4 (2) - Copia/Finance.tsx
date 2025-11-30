
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, ArrowUpRight, ArrowDownRight, Lock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Finance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // For user specified category

  const COLORS = ['#d97706', '#78716c', '#a8a29e', '#f59e0b', '#44403c'];

  // Categories mapping based on type
  const INCOME_CATEGORIES = [
    'Atendimento Salão',
    'Atendimento Domicílio',
    'Venda de Produtos',
    'Comissão de Funcionário',
    'Outros'
  ];

  const EXPENSE_CATEGORIES = [
    'Aluguel',
    'Energia Elétrica',
    'Água',
    'Internet',
    'Transporte',
    'Materiais/Produtos',
    'Comissão Paga',
    'Marketing',
    'Outros'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  // Update default category when type changes
  useEffect(() => {
     setCategory(type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
     setCustomCategory('');
  }, [type]);

  const addTransaction = () => {
    if (!amount) return;
    
    // Determine final category name
    let finalCategory = category;
    if (category === 'Outros' && customCategory) {
       finalCategory = customCategory; // Use the custom text
    }

    const t: Transaction = {
      id: Date.now().toString(),
      name: desc || finalCategory, // Fallback name to category if desc empty
      value: Number(amount),
      type,
      category: finalCategory as any,
      date: new Date().toLocaleDateString(),
      paymentMethod: 'Dinheiro'
    };
    const updated = [t, ...transactions];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    
    // Reset form
    setDesc('');
    setAmount('');
    setCustomCategory('');
    setShowForm(false);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.value, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.value, 0);
  const balance = totalIncome - totalExpense;

  const isPremium = user?.plan === 'premium';

  // Prepare Chart Data
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      const found = acc.find((i: any) => i.name === t.category);
      if (found) found.value += t.value;
      else acc.push({ name: t.category, value: t.value });
      return acc;
    }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-light dark:text-stone-100">Painel Financeiro</h2>
         {!isPremium && <span className="bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[10px] font-bold px-2 py-1 rounded">Versão Gratuita</span>}
       </div>

       {/* Summary Cards - Available for Everyone */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
             <p className="text-stone-500 dark:text-stone-400 text-sm mb-1">Entradas</p>
             <h3 className="text-2xl font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                R$ {totalIncome.toFixed(2)} <ArrowUpRight size={20} />
             </h3>
          </div>
          <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
             <p className="text-stone-500 dark:text-stone-400 text-sm mb-1">Saídas</p>
             <h3 className="text-2xl font-medium text-red-500 dark:text-red-400 flex items-center gap-2">
                R$ {totalExpense.toFixed(2)} <ArrowDownRight size={20} />
             </h3>
          </div>
          <div className="bg-stone-900 dark:bg-stone-700 p-5 rounded-2xl shadow-sm text-white">
             <p className="text-stone-400 text-sm mb-1">Saldo Atual</p>
             <h3 className="text-2xl font-medium text-gold-400">
                R$ {balance.toFixed(2)}
             </h3>
          </div>
       </div>

       {/* Action & Form */}
       <div>
         <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full py-3 border-2 border-dashed border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-400 rounded-xl hover:border-gold-400 hover:text-gold-500 transition-colors flex justify-center items-center gap-2"
         >
           <Plus size={18} /> Registrar Transação
         </button>
       </div>

       {showForm && (
         <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-md animate-fade-in border border-stone-100 dark:border-stone-700">
            <h3 className="text-lg font-medium mb-4 dark:text-stone-100">Nova Movimentação</h3>
            
            <div className="space-y-4">
                {/* Type Selection */}
                <div className="flex bg-stone-100 dark:bg-stone-700 p-1 rounded-xl">
                    <button 
                        onClick={() => setType('income')} 
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'}`}
                    >
                        Entrada (+)
                    </button>
                    <button 
                        onClick={() => setType('expense')} 
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-stone-500'}`}
                    >
                        Saída (-)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Valor (R$)</label>
                        <input 
                            type="number"
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-500"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Tipo de Movimentação</label>
                        <select 
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-500"
                        >
                            {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Conditional Inputs */}
                {category === 'Outros' && (
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Qual o motivo?</label>
                        <input 
                            placeholder="Especifique (ex: Conserto do Ar Condicionado)" 
                            value={customCategory} 
                            onChange={e => setCustomCategory(e.target.value)}
                            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-500"
                        />
                    </div>
                )}

                {/* Description */}
                <div>
                   <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Observação (Opcional)</label>
                   <input 
                     placeholder="Detalhes (ex: Nome da Cliente, Mês de ref.)" 
                     value={desc} 
                     onChange={e => setDesc(e.target.value)}
                     className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-500"
                   />
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-stone-200 dark:border-stone-600 rounded-xl text-stone-500">
                    Cancelar
                </button>
                <button 
                  onClick={addTransaction} 
                  disabled={!amount}
                  className="flex-[2] bg-stone-800 dark:bg-gold-500 dark:text-stone-900 text-white py-3 rounded-xl font-medium disabled:opacity-50"
                >
                  Confirmar
                </button>
            </div>
         </div>
       )}

       {/* Chart Section - Premium Only */}
       <div className="relative">
         {expenseData.length > 0 && (
            <div className={`bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 transition-all ${!isPremium ? 'blur-sm opacity-60 select-none' : ''}`}>
               <h3 className="text-lg font-medium mb-4 dark:text-stone-200">Despesas por Categoria</h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {expenseData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {expenseData.map((e: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                      {e.name}
                    </div>
                  ))}
               </div>
            </div>
         )}
         
         {!isPremium && expenseData.length > 0 && (
           <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/90 dark:bg-stone-800/90 p-6 rounded-2xl shadow-xl text-center max-w-sm border border-gold-200 dark:border-stone-600">
                 <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock size={24} />
                 </div>
                 <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-2">Análise Financeira Premium</h3>
                 <p className="text-sm text-stone-500 mb-4">Desbloqueie gráficos detalhados e veja exatamente para onde seu dinheiro está indo.</p>
                 <button onClick={() => navigate('/plans')} className="bg-gold-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-gold-600 transition-colors">
                   Ver Premium
                 </button>
              </div>
           </div>
         )}
       </div>

       {/* List */}
       <div className="space-y-3">
          <h3 className="text-lg font-medium dark:text-stone-200">Histórico Recente</h3>
          {transactions.slice(0, 5).map(t => (
            <div key={t.id} className="flex justify-between items-center p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700">
               <div>
                  <p className="font-medium text-stone-800 dark:text-stone-200">{t.name}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{t.date} • {t.category}</p>
               </div>
               <span className={`font-medium ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                 {t.type === 'income' ? '+' : '-'} R$ {t.value.toFixed(2)}
               </span>
            </div>
          ))}
          {!isPremium && transactions.length > 5 && (
             <div className="text-center py-4 text-xs text-stone-400 italic">
                Histórico completo disponível no Premium
             </div>
          )}
       </div>
    </div>
  );
};

export default Finance;
