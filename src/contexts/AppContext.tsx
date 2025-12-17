import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Client, ActivityLog, Settings, TabType } from '@/types';

interface AppContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  trashedClients: Client[];
  setTrashedClients: React.Dispatch<React.SetStateAction<Client[]>>;
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  currentTab: TabType;
  setCurrentTab: React.Dispatch<React.SetStateAction<TabType>>;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  restoreClient: (id: string) => void;
  permanentDeleteClient: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john@example.com',
    website: 'johnsmith.com',
    price: 2500,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'critical',
    autoPay: false,
    notes: 'Premium client',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1987654321',
    email: 'sarah@company.com',
    website: 'sarahj.com',
    price: 3500,
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    autoPay: true,
    notes: 'Annual subscription',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mike Wilson',
    phone: '+1122334455',
    email: 'mike@wilson.net',
    website: 'mikewilson.net',
    price: 1500,
    expiryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired',
    autoPay: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Emily Davis',
    phone: '+1555666777',
    email: 'emily@davis.org',
    website: 'emilydavis.org',
    price: 4000,
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    autoPay: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Alex Brown',
    phone: '+1888999000',
    email: 'alex@brown.co',
    website: 'alexbrown.co',
    price: 2000,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'critical',
    autoPay: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleLogs: ActivityLog[] = [
  { id: '1', action: 'added', clientName: 'John Smith', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: '2', action: 'edited', clientName: 'Sarah Johnson', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: '3', action: 'message_sent', clientName: 'Mike Wilson', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

const defaultSettings: Settings = {
  appName: 'ClientHub Pro',
  currency: '₹',
  monthlyGoal: 100000,
  messageFrequency: 3,
  templates: {
    reminder: 'Hi {name}, your subscription for {website} expires in {days} days. Amount: {currency}{price}',
    critical: 'URGENT: {name}, your {website} subscription expires in {days} days! Please renew to avoid service interruption.',
    expired: 'Hi {name}, your subscription for {website} has expired. Please renew immediately.',
    welcome: 'Welcome {name}! Your subscription for {website} is now active.',
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [trashedClients, setTrashedClients] = useState<Client[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(sampleLogs);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 20));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
    addActivityLog({ action: 'added', clientName: newClient.name });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...updates, updatedAt: new Date().toISOString() }
        : client
    ));
    const client = clients.find(c => c.id === id);
    if (client) {
      addActivityLog({ action: 'edited', clientName: client.name });
    }
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setTrashedClients(prev => [...prev, client]);
      setClients(prev => prev.filter(c => c.id !== id));
      addActivityLog({ action: 'deleted', clientName: client.name });
    }
  };

  const restoreClient = (id: string) => {
    const client = trashedClients.find(c => c.id === id);
    if (client) {
      setClients(prev => [...prev, client]);
      setTrashedClients(prev => prev.filter(c => c.id !== id));
      addActivityLog({ action: 'restored', clientName: client.name });
    }
  };

  const permanentDeleteClient = (id: string) => {
    setTrashedClients(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider value={{
      clients,
      setClients,
      trashedClients,
      setTrashedClients,
      activityLogs,
      addActivityLog,
      settings,
      setSettings,
      currentTab,
      setCurrentTab,
      addClient,
      updateClient,
      deleteClient,
      restoreClient,
      permanentDeleteClient,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
