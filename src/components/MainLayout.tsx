import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ClientTable } from './ClientTable';
import { WhatsAppCenter } from './WhatsAppCenter';
import { RazorpayFeed } from './RazorpayFeed';
import { WebsiteRenewals } from './WebsiteRenewals';
import { TrashBin } from './TrashBin';
import { SettingsPage } from './SettingsPage';

export function MainLayout() {
  const { currentTab } = useApp();

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientTable />;
      case 'whatsapp':
        return <WhatsAppCenter />;
      case 'razorpay':
        return <RazorpayFeed />;
      case 'renewals':
        return <WebsiteRenewals />;
      case 'trash':
        return <TrashBin />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
