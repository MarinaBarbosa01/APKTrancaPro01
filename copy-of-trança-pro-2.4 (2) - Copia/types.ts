
export interface BraidService {
  id: string;
  name: string;
  avgTime: number; // in hours (decimal, e.g. 2.5 = 2h30)
  price: number;
  description?: string;
  materialReq?: string; // Descrição dos materiais necessários
  image?: string; // Base64 ou URL da imagem de referência
}

export interface Transaction {
  id: string;
  name: string;
  category: 'Serviço' | 'Aluguel' | 'Transporte' | 'Materiais' | 'Outros';
  date: string;
  paymentMethod: string;
  value: number;
  type: 'income' | 'expense';
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type AppointmentOrigin = 'app_manual' | 'public_link' | 'google_calendar';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  status: AppointmentStatus;
  origin: AppointmentOrigin;
  createdAt: string; // ISO String
  googleEventId?: string; // For sync
}

export interface StoreReview {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  distance?: string;
  reviews: StoreReview[];
  instagramUrl?: string;
  mapsUrl?: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  category: string;
  readTime: string;
  learnList: string[];
  content: string;
}

export interface WorkingDay {
  isOpen: boolean;
  start: string; // "09:00"
  end: string; // "18:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface PublicProfileSettings {
  username: string;
  bio: string;
  whatsapp: string;
  policies: string;
  workingHours: {
    [key: number]: WorkingDay; // 0 (Sun) - 6 (Sat)
  };
  services: BraidService[]; // Lista personalizada de serviços
  googleSyncEnabled: boolean;
}

export type AiCommunicationStyle = 'parceira' | 'formal' | 'mentora';

// Lista abrangente de gêneros para inclusão
export type Gender = 
  | 'Mulher Cis' 
  | 'Mulher Trans' 
  | 'Homem Cis' 
  | 'Homem Trans' 
  | 'Não-Binário' 
  | 'Agênero' 
  | 'Gênero Fluido'
  | 'Travesti'
  | 'Queer'
  | 'Prefiro não dizer' 
  | 'Outro';

export interface Feedback {
  id: string;
  author: string;
  type: 'sugestao' | 'reclamacao' | 'elogio';
  message: string;
  date: string;
  status: 'pendente' | 'lido';
}

// User Profile Update
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  gender?: Gender;
  verified: boolean;
  memberSince: string;
  goal?: string;
  plan: 'free' | 'premium';
  
  // AI Limits
  aiUsageCount: number; // Kept for analytics
  aiSessionStart?: number; // Timestamp of when the 2h session started

  communicationStyle: AiCommunicationStyle;
  publicProfile?: PublicProfileSettings; 
}

export const DEFAULT_BRAID_CATALOG: BraidService[] = [
  { id: '1', name: 'Box Braids', avgTime: 6, price: 250, description: 'Tranças soltas com extensão sintética, versáteis e duradouras.', materialReq: '2 pacotes de jumbo' },
  { id: '2', name: 'Knotless Braids', avgTime: 7, price: 280, description: 'Técnica sem nó na raiz, proporcionando menos tensão e aspecto natural.', materialReq: '2 pacotes de jumbo' },
  { id: '3', name: 'Trança na raiz', avgTime: 2, price: 80, description: 'Tranças rasteiras desenhadas no couro cabeludo.', materialReq: '1 pacote de jumbo' },
  { id: '4', name: 'Nagô', avgTime: 3, price: 100, description: 'Trança rasteira tradicional.', materialReq: '1 pacote de jumbo' },
  { id: '5', name: 'Nagô masculina', avgTime: 1.5, price: 60, materialReq: '1 pacote de jumbo' },
  { id: '6', name: 'Nagô zigue-zague', avgTime: 2.5, price: 90, materialReq: '1 pacote de jumbo' },
  { id: '7', name: 'Nagô geométrica', avgTime: 3, price: 120, materialReq: '1 pacote de jumbo' },
  { id: '8', name: 'Nagô com extensão', avgTime: 4, price: 150, materialReq: '1 pacote de jumbo (se tiver pontas soltas: + 1 pacote de cachos)' },
  { id: '9', name: 'Fulani Braids', avgTime: 5, price: 220, description: 'Estilo tribal com tranças de diferentes espessuras e acessórios.', materialReq: '1 pacote de jumbo (+ 1 pacote de cachos se tiver pontas soltas)' },
  { id: '10', name: 'Twist', avgTime: 5, price: 200, materialReq: '2 pacotes de jumbo' },
  { id: '11', name: 'Twists (Senegalese/Malise)', avgTime: 5, price: 200, materialReq: '2 pacotes de jumbo' },
  { id: '12', name: 'Rope Braid (estilo afro)', avgTime: 4, price: 180, materialReq: '2 pacotes de jumbo' },
  { id: '13', name: 'Ghana Braids', avgTime: 4, price: 160, materialReq: '1 pacote de jumbo' },
  { id: '14', name: 'Cornrows', avgTime: 2, price: 80, materialReq: '1 pacote de jumbo' },
  { id: '15', name: 'Gypsy Braids', avgTime: 6.5, price: 300, description: 'Box braids com pontas soltas e cacheadas, visual boêmio.', materialReq: '2 pacotes de jumbo + 1 pacote de cachos' },
  { id: '16', name: 'Goddess Braids', avgTime: 7, price: 320, description: 'Box braids misturadas com fios cacheados soltos.', materialReq: '2 pacotes de jumbo + 1 pacote de cachos' },
  { id: '17', name: 'Fishtail Braid', avgTime: 1, price: 50, materialReq: 'Não usa jumbo (opcional 1 pacote se quiser volume extra)' },
  { id: '18', name: 'French Braid', avgTime: 1, price: 50, materialReq: 'Não usa jumbo' },
  { id: '19', name: 'Dutch Braid', avgTime: 1, price: 50, materialReq: 'Não usa jumbo' },
  { id: '20', name: 'Crown Braid', avgTime: 1.5, price: 70, materialReq: 'Não usa jumbo' },
  { id: '21', name: 'Halo Braid', avgTime: 1.5, price: 70, materialReq: 'Não usa jumbo' },
  { id: '22', name: 'Waterfall Braid', avgTime: 1, price: 60, materialReq: 'Não usa jumbo' },
  { id: '23', name: 'Spiral Braid', avgTime: 4, price: 150, materialReq: 'Não usa jumbo' },
  { id: '24', name: 'Russian Braid', avgTime: 2, price: 80, materialReq: 'Não usa jumbo' },
  { id: '25', name: 'Koroba', avgTime: 3, price: 110, materialReq: '1 pacote de jumbo' },
  { id: '26', name: 'Shuku', avgTime: 3, price: 110, materialReq: '1 pacote de jumbo' },
  { id: '27', name: 'Rasta', avgTime: 5, price: 250, description: 'Dreads sintéticos instalados.', materialReq: '6 a 8 pacotes de dreads prontos' },
  { id: '28', name: 'Crochet Braids', avgTime: 3, price: 180, description: 'Aplicação de extensão pronta usando agulha de crochê.', materialReq: '6 a 8 pacotes de crochet' },
  { id: '29', name: 'African Threading', avgTime: 4, price: 100, materialReq: 'Usa linha/lã (não usa jumbo)' },
  { id: '30', name: 'Pancake Braids', avgTime: 1.5, price: 60, materialReq: 'Não usa jumbo' },
  { id: '31', name: 'Chanel Braids', avgTime: 5, price: 200, description: 'Box braids curtas, corte chanel.', materialReq: '1 a 2 pacotes de jumbo' },
  { id: '32', name: 'Penteados Casamento', avgTime: 3, price: 250, materialReq: 'Não usam jumbo (opcional 1 pacote para volume)' },
  { id: '33', name: 'Coque com tranças', avgTime: 2, price: 120, materialReq: 'Não usa jumbo (opcional 1 pacote para volume)' },
  { id: '34', name: 'Semi-preso', avgTime: 1.5, price: 90, materialReq: 'Não usa jumbo (opcional 1 pacote para volume)' },
  { id: '35', name: 'Trança lateral noiva', avgTime: 2, price: 150, materialReq: 'Não usa jumbo' },
  { id: '36', name: 'Rave Braids', avgTime: 2, price: 100, materialReq: '2 pacotes de jumbo (+ 1 pacote de cachos se for estilo boho)' },
  { id: '37', name: 'Mandraka Braids', avgTime: 4, price: 180, materialReq: '2 pacotes de jumbo' },
];
