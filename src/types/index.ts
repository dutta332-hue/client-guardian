export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  website: string;
  price: number;
  expiryDate: string;
  status: 'active' | 'critical' | 'expired' | 'pending';
  autoPay: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageSent?: string;
}

export interface ActivityLog {
  id: string;
  action: 'added' | 'edited' | 'deleted' | 'restored' | 'message_sent';
  clientName: string;
  timestamp: string;
  details?: string;
}

export interface Settings {
  appName: string;
  currency: string;
  monthlyGoal: number;
  messageFrequency: number;
  templates: {
    reminder: string;
    critical: string;
    expired: string;
    welcome: string;
  };
}

export interface DashboardMetrics {
  totalClients: number;
  monthlyRevenue: number;
  pendingCollections: number;
  arpu: number;
  revenueProgress: number;
}

export type FilterType = 'all' | 'pending' | 'critical' | 'expired' | 'active';

export type TabType = 'dashboard' | 'clients' | 'whatsapp' | 'razorpay' | 'renewals' | 'trash' | 'settings';
