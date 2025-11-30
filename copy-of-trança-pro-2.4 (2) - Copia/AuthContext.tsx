
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicProfileSettings, DEFAULT_BRAID_CATALOG, AiCommunicationStyle, Feedback, Gender, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePublicProfile: (data: Partial<PublicProfileSettings>) => void;
  sendVerificationCode: (contact: string, type: 'email' | 'whatsapp') => Promise<string>;
  upgradePlan: () => void;
  checkAiLimit: () => boolean;
  recordAiInteraction: () => void; // Replaces separate start/increment to avoid race conditions
  getAiStatus: () => { status: 'premium' | 'idle' | 'active' | 'blocked', msRemaining: number };
  submitFeedback: (fb: Omit<Feedback, 'id' | 'date' | 'status'>) => void;
  getFeedbacks: () => Feedback[];
  deleteFeedback: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_WORKING_HOURS = {
  0: { isOpen: false, start: "09:00", end: "18:00" }, // Sun
  1: { isOpen: true, start: "09:00", end: "18:00" },  // Mon
  2: { isOpen: true, start: "09:00", end: "18:00" },  // Tue
  3: { isOpen: true, start: "09:00", end: "18:00" },  // Wed
  4: { isOpen: true, start: "09:00", end: "18:00" },  // Thu
  5: { isOpen: true, start: "09:00", end: "18:00" },  // Fri
  6: { isOpen: true, start: "09:00", end: "18:00" },  // Sat
};

// AI Limits Logic (Time Based)
const USAGE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours active
const BLOCK_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours cooldown
const TOTAL_CYCLE_MS = USAGE_DURATION_MS + BLOCK_DURATION_MS; // 5 hours total cycle

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Default demo user generator
  const createDemoUser = (): UserProfile => ({
    id: 'demo-user-1',
    name: 'Trancista Iniciante',
    email: 'trancista@demo.com',
    phone: '(11) 99999-9999',
    gender: 'Prefiro não dizer',
    verified: true,
    memberSince: new Date().toLocaleDateString(),
    plan: 'free',
    aiUsageCount: 0,
    communicationStyle: 'parceira',
    publicProfile: {
      username: 'trancistademo',
      bio: 'Apaixonada por tranças.',
      whatsapp: '11999999999',
      policies: 'Tolerância de 15 min.',
      workingHours: DEFAULT_WORKING_HOURS,
      services: DEFAULT_BRAID_CATALOG,
      googleSyncEnabled: false
    }
  });

  useEffect(() => {
    // Check local storage for persistent session
    const savedUser = localStorage.getItem('trancaProUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (!parsed.plan) parsed.plan = 'free';
        if (typeof parsed.aiUsageCount !== 'number') parsed.aiUsageCount = 0;
        if (!parsed.communicationStyle) parsed.communicationStyle = 'parceira';
        
        // Upgrade existing users to have services list if they don't
        if (parsed.publicProfile && !parsed.publicProfile.services) {
            parsed.publicProfile.services = DEFAULT_BRAID_CATALOG;
        }

        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user from storage", e);
        // Fallback to demo user if storage is corrupted
        const demo = createDemoUser();
        setUser(demo);
        localStorage.setItem('trancaProUser', JSON.stringify(demo));
      }
    } else {
      // Auto-login demo user for immediate app usage experience
      const demo = createDemoUser();
      setUser(demo);
      localStorage.setItem('trancaProUser', JSON.stringify(demo));
    }

    const savedFeedbacks = localStorage.getItem('appFeedbacks');
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  const saveUser = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('trancaProUser', JSON.stringify(userData));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: UserProfile = {
      ...createDemoUser(),
      name: 'Trancista Pro',
      email: email,
      plan: 'free',
    };
    saveUser(mockUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const googleUser: UserProfile = {
      id: 'google-user-' + Date.now(),
      name: 'Usuário Google',
      email: 'trancista.google@gmail.com',
      phone: '',
      gender: 'Prefiro não dizer',
      verified: true,
      memberSince: new Date().toLocaleDateString(),
      photo: 'https://lh3.googleusercontent.com/a/default-user',
      plan: 'free',
      aiUsageCount: 0,
      communicationStyle: 'parceira',
      publicProfile: {
         username: 'user' + Date.now(),
         bio: '',
         whatsapp: '',
         policies: '',
         workingHours: DEFAULT_WORKING_HOURS,
         services: DEFAULT_BRAID_CATALOG,
         googleSyncEnabled: false
      }
    };
    saveUser(googleUser);
    return true;
  };

  const register = async (data: any): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      verified: false,
      memberSince: new Date().toLocaleDateString(),
      goal: 'Crescer meu negócio',
      plan: 'free',
      gender: 'Prefiro não dizer',
      aiUsageCount: 0,
      communicationStyle: 'parceira',
      publicProfile: {
         username: data.name.toLowerCase().replace(/\s+/g, ''),
         bio: '',
         whatsapp: data.phone,
         policies: '',
         workingHours: DEFAULT_WORKING_HOURS,
         services: DEFAULT_BRAID_CATALOG,
         googleSyncEnabled: false
      }
    };
    setUser(newUser); // Don't save to localstorage yet until verified
    return true;
  };

  const sendVerificationCode = async (contact: string, type: 'email' | 'whatsapp'): Promise<string> => {
     await new Promise(resolve => setTimeout(resolve, 1500));
     const code = Math.floor(1000 + Math.random() * 9000).toString();
     setVerificationCode(code);
     setTimeout(() => {
        alert(`[SIMULAÇÃO] Seu código de verificação ${type === 'whatsapp' ? 'WhatsApp' : 'E-mail'} é: ${code}`);
     }, 500);
     return code;
  };

  const verifyCode = async (inputCode: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (inputCode === verificationCode || inputCode === '0000') {
      if (user) {
        const updatedUser = { ...user, verified: true };
        saveUser(updatedUser);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trancaProUser');
    window.location.reload(); // Reload to reset state
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      saveUser(updated);
    }
  };

  const updatePublicProfile = (data: Partial<PublicProfileSettings>) => {
    if (user && user.publicProfile) {
      const updated = { 
        ...user, 
        publicProfile: { ...user.publicProfile, ...data } 
      };
      saveUser(updated);
    } else if (user) {
       // Initialize if undefined
       const updated = {
         ...user,
         publicProfile: {
            username: user.name.toLowerCase().replace(/\s+/g, ''),
            bio: '',
            whatsapp: user.phone || '',
            policies: '',
            workingHours: DEFAULT_WORKING_HOURS,
            services: DEFAULT_BRAID_CATALOG,
            googleSyncEnabled: false,
            ...data
         }
       };
       saveUser(updated);
    }
  };

  const upgradePlan = () => {
    if (user) {
      const updated: UserProfile = { ...user, plan: 'premium' };
      saveUser(updated);
      alert("Parabéns! Sua conta agora é Premium 👑");
    }
  };

  // --- AI TIME LIMIT LOGIC ---

  const checkAiLimit = (): boolean => {
    if (!user) return false;
    if (user.plan === 'premium') return true;
    
    // If usage hasn't started yet, we allow it (the session will start on the interaction)
    if (!user.aiSessionStart) return true;

    const now = Date.now();
    const elapsed = now - user.aiSessionStart;

    // Check if we are in the Usage Window (2h)
    if (elapsed < USAGE_DURATION_MS) return true;

    // Check if we are in the Block Window (Between 2h and 5h)
    if (elapsed >= USAGE_DURATION_MS && elapsed < TOTAL_CYCLE_MS) return false;

    // If Cycle is Over (Elapsed > 5h), we allow it because it will reset on next interaction
    return true;
  };

  // Atomic function to handle AI Interaction state to avoid race conditions
  const recordAiInteraction = () => {
    if (!user) return;
    
    const now = Date.now();
    let updatedUser = { ...user };
    let changed = false;

    // 1. Start Session Logic
    if (user.plan !== 'premium') {
        if (!user.aiSessionStart || (now - user.aiSessionStart > TOTAL_CYCLE_MS)) {
            updatedUser.aiSessionStart = now;
            changed = true;
        }
    }

    // 2. Increment Usage Count
    updatedUser.aiUsageCount = (updatedUser.aiUsageCount || 0) + 1;
    changed = true;

    if (changed) {
        saveUser(updatedUser);
    }
  };

  const getAiStatus = () => {
    if (!user || user.plan === 'premium') {
        return { status: 'premium', msRemaining: 0 } as const;
    }

    if (!user.aiSessionStart) {
        return { status: 'idle', msRemaining: USAGE_DURATION_MS } as const;
    }

    const now = Date.now();
    const elapsed = now - user.aiSessionStart;

    // If cycle completed ( > 5h), we are back to IDLE (waiting for trigger)
    if (elapsed > TOTAL_CYCLE_MS) {
        return { status: 'idle', msRemaining: USAGE_DURATION_MS } as const;
    }

    // Active Phase ( < 2h )
    if (elapsed < USAGE_DURATION_MS) {
        return { status: 'active', msRemaining: USAGE_DURATION_MS - elapsed } as const;
    }

    // Blocked Phase ( 2h - 5h )
    return { status: 'blocked', msRemaining: TOTAL_CYCLE_MS - elapsed } as const;
  };

  // Feedback System
  const submitFeedback = (fbData: Omit<Feedback, 'id' | 'date' | 'status'>) => {
    const newFeedback: Feedback = {
      ...fbData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      status: 'pendente'
    };
    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('appFeedbacks', JSON.stringify(updated));
  };

  const getFeedbacks = () => feedbacks;

  const deleteFeedback = (id: string) => {
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('appFeedbacks', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user?.verified, 
      login, 
      loginWithGoogle,
      register, 
      verifyCode, 
      logout, 
      updateProfile,
      updatePublicProfile,
      sendVerificationCode,
      upgradePlan,
      checkAiLimit,
      recordAiInteraction,
      getAiStatus,
      submitFeedback,
      getFeedbacks,
      deleteFeedback
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
