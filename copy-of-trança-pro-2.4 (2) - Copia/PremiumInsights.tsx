import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Jan', value: 2400 },
  { name: 'Fev', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Abr', value: 3908 },
  { name: 'Mai', value: 4800 },
  { name: 'Jun', value: 3800 },
];

const PremiumInsights = () => {
  // This is a "teaser" component since we don't have real complex data backend
  // In a real app, this would check subscription status
  const isPremium = false; 

  if (!isPremium) {
      return (
          <div className="relative min-h-screen">
              <div className="absolute inset-0 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-xl max-w-md border border-gold-200 dark:border-stone-600">
                      <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-600">
                          <Lock size={32} />
                      </div>
                      <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Recurso Premium</h2>
                      <p className="text-stone-500 dark:text-stone-400 mb-6">Desbloqueie análises detalhadas, gráficos de crescimento e descubra quais serviços trazem mais lucro para você.</p>
                      <Link to="/plans" className="block w-full bg-gradient-to-r from-gold-400 to-amber-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all">
                          Ver Planos
                      </Link>
                  </div>
              </div>
              
              {/* Blurred Background Content */}
              <div className="opacity-20 pointer-events-none filter blur-sm">
                  <h2 className="text-2xl font-light mb-6">Insights Avançados</h2>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                     <div className="h-24 bg-stone-200 rounded-xl"></div>
                     <div className="h-24 bg-stone-200 rounded-xl"></div>
                     <div className="h-24 bg-stone-200 rounded-xl"></div>
                     <div className="h-24 bg-stone-200 rounded-xl"></div>
                  </div>
                  <div className="h-64 bg-stone-200 rounded-xl mb-8"></div>
              </div>
          </div>
      )
  }

  return <div>Premium Content (Mock)</div>;
};

export default PremiumInsights;
