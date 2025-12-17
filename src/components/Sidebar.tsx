import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { TabType } from '@/types';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  CreditCard, 
  RefreshCw, 
  Trash2, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'All Customers', icon: Users },
  { id: 'whatsapp', label: 'WhatsApp Center', icon: MessageCircle },
  { id: 'razorpay', label: 'Razorpay Feed', icon: CreditCard },
  { id: 'renewals', label: 'Website Renewals', icon: RefreshCw },
];

const secondaryNavItems: NavItem[] = [
  { id: 'trash', label: 'Trash', icon: Trash2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { currentTab, setCurrentTab, settings } = useApp();
  const { logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground text-lg leading-tight">
            {settings.appName}
          </h1>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}

        <Separator className="bg-sidebar-border my-4" />

        <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-3">
          System
        </p>
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
