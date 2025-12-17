import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { MetricCard } from './MetricCard';
import { ActivityLog } from './ActivityLog';
import { ExpiryChart } from './ExpiryChart';
import { Users, IndianRupee, Clock, TrendingUp } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export function Dashboard() {
  const { clients, settings } = useApp();

  // Calculate metrics
  const activeClients = clients.filter(c => c.status !== 'expired').length;
  
  const monthlyRevenue = clients.reduce((sum, client) => {
    const daysLeft = differenceInDays(new Date(client.expiryDate), new Date());
    if (daysLeft >= 0 || client.autoPay) {
      return sum + client.price;
    }
    return sum;
  }, 0);

  const pendingCollections = clients.reduce((sum, client) => {
    const daysLeft = differenceInDays(new Date(client.expiryDate), new Date());
    if (daysLeft < 0 && !client.autoPay) {
      return sum + client.price;
    }
    return sum;
  }, 0);

  const arpu = activeClients > 0 ? Math.round(monthlyRevenue / activeClients) : 0;
  const revenueProgress = Math.min(Math.round((monthlyRevenue / settings.monthlyGoal) * 100), 100);

  const formatCurrency = (value: number) => {
    return `${settings.currency}${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Clients"
          value={clients.length}
          subtitle={`${activeClients} active`}
          icon={Users}
          variant="primary"
        />
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          icon={IndianRupee}
          progress={revenueProgress}
          variant="success"
        />
        <MetricCard
          title="Pending Collections"
          value={formatCurrency(pendingCollections)}
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="ARPU"
          value={formatCurrency(arpu)}
          subtitle="Avg. revenue per user"
          icon={TrendingUp}
          variant="accent"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiryChart />
        <ActivityLog />
      </div>
    </div>
  );
}
