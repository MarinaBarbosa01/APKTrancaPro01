import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Calculator, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  MapPin, 
  Sparkles, 
  Settings, 
  Menu, 
  X,
  ScanLine
} from 'lucide-react';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';

// Components
import Home from './components/Home';
import PricingCalculator from './components/PricingCalculator';
import Agenda from './components/Agenda';
import Finance from './components/Finance';
import MaterialsCalculator from './components/MaterialsCalculator';
import Learn from './components/Learn';
import Stores from './components/Stores';
import AiHub from './components/AiHub';
import PremiumInsights from './components/PremiumInsights';
import ProfessionalScan from './components/ProfessionalScan';
import Plans from './components/Plans';
import SettingsPage from './components/SettingsPage';

// Fix: Make children required as Layout is a wrapper
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: HomeIcon, label: 'Início', path: '/' },
    { icon: Calculator, label: 'Calc. Preço', path: '/pricing' },
    { icon: Calendar, label: 'Agenda', path: '/agenda' },
    { icon: DollarSign, label: 'Financeiro', path: '/finance' },
    { icon: ScanLine, label: 'Escaneamento', path: '/scan' },
    { icon: BookOpen, label: 'Aprenda', path: '/learn' },
    { icon: Calculator, label: 'Materiais', path: '/materials' },
    { icon: MapPin, label: 'Lojas', path: '/stores' },
    { icon: Sparkles, label: 'Estúdio IA', path: '/ai' },
    { icon: DollarSign, label: 'Planos', path: '/plans' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 font-sans transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-medium tracking-tight text-stone-800 dark:text-gold-400">Trança Pro</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-stone-100 dark:border-stone-700">
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-gold-400">Trança Pro</h1>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/ai' && location.pathname.startsWith('/ai'));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-stone-100 dark:bg-stone-700 text-gold-600 dark:text-gold-400' 
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
             <div className="bg-gradient-to-br from-gold-400 to-amber-600 rounded-xl p-4 text-white">
                <p className="text-xs font-medium opacity-90 mb-1">Seja Premium</p>
                <h3 className="font-bold text-sm mb-2">Desbloqueie tudo</h3>
                <button 
                  onClick={() => {
                    navigate('/plans');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full bg-white text-amber-700 text-xs py-2 rounded-lg font-bold"
                >
                  Ver Planos
                </button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-20 lg:pt-8 px-4 lg:px-8 pb-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<PricingCalculator />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/materials" element={<MaterialsCalculator />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="/ai" element={<AiHub />} />
              <Route path="/premium-insights" element={<PremiumInsights />} />
              <Route path="/scan" element={<ProfessionalScan />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;