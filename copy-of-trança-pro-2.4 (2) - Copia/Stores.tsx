
import React, { useState, useEffect } from 'react';
import { Store, StoreReview } from '../types';
import { MapPin, Search, Star, Navigation, X, Send, Globe, ShoppingBag } from 'lucide-react';

const BRAZIL_STORES: Store[] = [
  // SÃO PAULO (O HUB)
  { id: 'sp1', name: 'Rei do Jumbo', address: 'R. da Cantareira, 385 (Região da 25)', city: 'São Paulo - SP', reviews: [] },
  { id: 'sp2', name: 'Du Chapéu Hair', address: 'R. Barão de Duprat, 21', city: 'São Paulo - SP', reviews: [] },
  { id: 'sp3', name: 'Metrópole Hair', address: 'Ladeira Porto Geral, 106', city: 'São Paulo - SP', reviews: [] },
  { id: 'sp4', name: 'Black Wig Brasil', address: 'R. 25 de Março, 641', city: 'São Paulo - SP', reviews: [] },
  { id: 'sp5', name: 'Kabelo\'s', address: 'R. Varnhagen, 44', city: 'São Paulo - SP', reviews: [] },
  { id: 'sp6', name: 'Galeria do Rock (Lojas Afro)', address: 'Av. São João, 439', city: 'São Paulo - SP', reviews: [] },
  { id: 'sp7', name: 'Spasso Cosméticos', address: 'Várias unidades', city: 'Campinas - SP', reviews: [] },

  // RIO DE JANEIRO
  { id: 'rj1', name: 'Perucas & Cia (Madureira)', address: 'Estr. do Portela, 99 (Mercadão)', city: 'Rio de Janeiro - RJ', reviews: [] },
  { id: 'rj2', name: 'Palácio dos Cabelos', address: 'R. da Conceição, 15', city: 'Rio de Janeiro - RJ', reviews: [] },
  { id: 'rj3', name: 'Casa da Manicura', address: 'R. Senhor dos Passos, 246', city: 'Rio de Janeiro - RJ', reviews: [] },
  { id: 'rj4', name: 'Lojão do Cabeleireiro', address: 'R. Gonçalves Dias, 46', city: 'Rio de Janeiro - RJ', reviews: [] },

  // BAHIA
  { id: 'ba1', name: 'Casa do Cabeleireiro', address: 'Av. Sete de Setembro', city: 'Salvador - BA', reviews: [] },
  { id: 'ba2', name: 'Rainha dos Cabelos', address: 'R. Carlos Gomes', city: 'Salvador - BA', reviews: [] },
  { id: 'ba3', name: 'Mundo do Cabeleireiro', address: 'Shopping da Gente', city: 'Salvador - BA', reviews: [] },

  // MINAS GERAIS
  { id: 'mg1', name: 'Shopping Oiapoque (Vários Boxes)', address: 'Av. Oiapoque, 156', city: 'Belo Horizonte - MG', reviews: [] },
  { id: 'mg2', name: 'Lojas Rede', address: 'R. Curitiba, 693', city: 'Belo Horizonte - MG', reviews: [] },
  { id: 'mg3', name: 'Casa da Boia Cosméticos', address: 'Av. Amazonas', city: 'Belo Horizonte - MG', reviews: [] },

  // PERNAMBUCO
  { id: 'pe1', name: 'Mundo do Cabeleireiro', address: 'R. Duque de Caxias', city: 'Recife - PE', reviews: [] },
  { id: 'pe2', name: 'Atacadão dos Cosméticos', address: 'R. das Calçadas', city: 'Recife - PE', reviews: [] },

  // ONLINE / ATACADO NACIONAL
  { id: 'web1', name: 'Ser Mulher Fibras (Site)', address: 'Entrega para todo Brasil', city: 'Online', reviews: [] },
  { id: 'web2', name: 'Zhang Hair (Site)', address: 'Entrega para todo Brasil', city: 'Online', reviews: [] },
  { id: 'web3', name: 'Chique Chique Cabelos', address: 'Entrega para todo Brasil', city: 'Online', reviews: [] },
  { id: 'web4', name: 'Mercado Livre (Vários Fornecedores)', address: 'App/Site', city: 'Online', reviews: [] },
  { id: 'web5', name: 'Shopee (Importados)', address: 'App/Site', city: 'Online', reviews: [] },
];

const Stores = () => {
  const [stores, setStores] = useState<Store[]>(BRAZIL_STORES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Load reviews from local storage to merge with static list
    const savedReviews = localStorage.getItem('storeReviews');
    if (savedReviews) {
      const parsedReviews: Record<string, StoreReview[]> = JSON.parse(savedReviews);
      setStores(prev => prev.map(s => ({
        ...s,
        reviews: parsedReviews[s.id] || []
      })));
    }
  }, []);

  const openStoreDetails = (store: Store) => {
    setSelectedStore(store);
    setShowReviewForm(false);
    setRating(5);
    setComment('');
  };

  const handleReviewSubmit = () => {
    if (!selectedStore) return;
    const review: StoreReview = {
      id: Date.now().toString(),
      author: 'Você',
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    
    const updatedStores = stores.map(s => {
      if (s.id === selectedStore.id) {
        return { ...s, reviews: [review, ...s.reviews] };
      }
      return s;
    });
    
    setStores(updatedStores);
    
    // Save to local storage
    const reviewsMap: Record<string, StoreReview[]> = {};
    updatedStores.forEach(s => {
       reviewsMap[s.id] = s.reviews;
    });
    localStorage.setItem('storeReviews', JSON.stringify(reviewsMap));
    
    setSelectedStore(updatedStores.find(s => s.id === selectedStore.id) || null);
    setShowReviewForm(false);
    setComment('');
    setRating(5);
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvgRating = (reviews: StoreReview[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((a, b) => a + b.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
         <h2 className="text-2xl font-light dark:text-stone-100">Onde Comprar?</h2>
         <p className="text-stone-500 dark:text-stone-400 text-sm">Os melhores picos pra comprar jumbo, orgânico e acessórios no precinho.</p>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-stone-400" size={18} />
          <input 
            placeholder="Procure por loja, cidade ou estado..."
            className="w-full pl-10 p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none focus:border-gold-400 transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStores.length === 0 ? (
          <div className="text-center py-10 opacity-60">
             <ShoppingBag size={48} className="mx-auto mb-2 text-stone-300"/>
             <p className="text-stone-500 dark:text-stone-400">Nenhuma loja encontrada com esse nome.<br/>Tenta buscar só pela cidade (ex: "Salvador").</p>
          </div>
        ) : (
          filteredStores.map(store => (
            <div key={store.id} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 hover:border-gold-200 dark:hover:border-stone-600 transition-colors group">
               <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${store.city === 'Online' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'}`}>
                        {store.city === 'Online' ? <Globe size={24}/> : <MapPin size={24} />}
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{store.name}</h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                          {store.address}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-300">
                           {store.city}
                        </span>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-gold-500 dark:text-gold-400 font-bold bg-gold-50 dark:bg-gold-900/10 px-2 py-1 rounded-lg">
                       <span>{getAvgRating(store.reviews)}</span> <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">{store.reviews.length} avaliações</span>
                  </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-stone-50 dark:border-stone-700/50">
                 <button 
                    onClick={() => openStoreDetails(store)}
                    className="w-full bg-stone-50 dark:bg-stone-700/50 text-stone-600 dark:text-stone-300 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors flex items-center justify-center gap-2"
                 >
                   Ver Detalhes e Opiniões
                 </button>
               </div>
            </div>
          ))
        )}
      </div>

      {selectedStore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in border border-stone-200 dark:border-stone-700 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-bold dark:text-stone-100 font-display">{selectedStore.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{selectedStore.address}</p>
                 </div>
                 <button onClick={() => setSelectedStore(null)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
                   <X size={20} />
                 </button>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-r from-stone-50 to-white dark:from-stone-800 dark:to-stone-800/50 p-5 rounded-2xl mb-6 border border-stone-100 dark:border-stone-700">
                 <div>
                   <div className="flex items-center gap-2 text-4xl font-bold text-stone-800 dark:text-stone-100 font-display">
                      {getAvgRating(selectedStore.reviews)} 
                      <div className="flex flex-col">
                        <Star size={24} fill="#f59e0b" className="text-gold-500" />
                      </div>
                   </div>
                   <p className="text-xs text-stone-400 mt-1">{selectedStore.reviews.length} trancistas avaliaram</p>
                 </div>
                 
                 {!showReviewForm && (
                   <button 
                     onClick={() => setShowReviewForm(true)}
                     className="bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-900 px-5 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                   >
                     Avaliar Loja
                   </button>
                 )}
              </div>

              {showReviewForm && (
                <div className="mb-6 bg-stone-50 dark:bg-stone-800 p-5 rounded-2xl animate-fade-in border border-gold-200 dark:border-stone-600 ring-2 ring-gold-400/10">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-sm dark:text-stone-200 text-stone-700">Como foi comprar lá?</h4>
                      <button onClick={() => setShowReviewForm(false)} className="text-xs text-stone-400 hover:text-red-500 font-medium">Cancelar</button>
                   </div>
                   
                   <div className="flex justify-center gap-3 mb-4 py-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setRating(star)} className="transform hover:scale-110 transition-transform p-1">
                           <Star 
                             size={32} 
                             fill={star <= rating ? "#f59e0b" : "none"}
                             className={`${star <= rating ? 'text-gold-500' : 'text-stone-300 dark:text-stone-600'}`} 
                           />
                        </button>
                      ))}
                   </div>
                   <textarea 
                      className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700/50 text-stone-800 dark:text-stone-100 text-sm outline-none focus:ring-2 focus:ring-gold-400 mb-3 resize-none"
                      rows={3}
                      placeholder="Conta pra gente: tem variedade? O preço é bom? O atendimento presta?"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                   ></textarea>
                   <button 
                     onClick={handleReviewSubmit}
                     className="w-full bg-gold-500 text-white py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-md"
                   >
                     <Send size={16} /> Publicar Avaliação
                   </button>
                </div>
              )}

              <div>
                 <h4 className="font-bold mb-4 text-stone-800 dark:text-stone-200 text-sm uppercase tracking-wide">O que as trancistas dizem</h4>
                 {selectedStore.reviews.length === 0 && (
                   <div className="text-center py-8 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-dashed border-stone-200 dark:border-stone-700">
                     <p className="text-stone-400 text-sm">Ninguém avaliou ainda.<br/>Salva as irmãs e conta sua experiência!</p>
                   </div>
                 )}
                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedStore.reviews.map(r => (
                       <div key={r.id} className="bg-stone-50 dark:bg-stone-800/30 p-4 rounded-xl border border-stone-100 dark:border-stone-700">
                          <div className="flex justify-between mb-2">
                             <span className="font-bold text-sm dark:text-stone-200">{r.author}</span>
                             <div className="flex text-gold-500 text-xs gap-0.5">
                                {Array.from({length: r.rating}).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                             </div>
                          </div>
                          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{r.comment}</p>
                          <p className="text-[10px] text-stone-400 mt-2 text-right">{r.date}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
