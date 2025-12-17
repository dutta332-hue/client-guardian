import React, { useMemo, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Client } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  PartyPopper,
  Filter
} from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type MessageCategory = 'expired' | 'critical' | 'reminder';

interface ClientWithCategory extends Client {
  category: MessageCategory;
  daysLeft: number;
}

export function WhatsAppCenter() {
  const { clients, settings, updateClient, addActivityLog } = useApp();
  const [activeFilter, setActiveFilter] = useState<MessageCategory | 'all'>('all');

  const messagableClients = useMemo(() => {
    const now = new Date();
    const frequencyDays = settings.messageFrequency;

    return clients
      .filter(client => {
        // Skip auto-pay clients
        if (client.autoPay) return false;

        // Check if message was sent recently
        if (client.lastMessageSent) {
          const lastSent = parseISO(client.lastMessageSent);
          const daysSinceLastMessage = differenceInDays(now, lastSent);
          if (daysSinceLastMessage < frequencyDays) return false;
        }

        return true;
      })
      .map(client => {
        const daysLeft = differenceInDays(new Date(client.expiryDate), now);
        let category: MessageCategory;

        if (daysLeft < 0) {
          category = 'expired';
        } else if (daysLeft <= 7) {
          category = 'critical';
        } else {
          category = 'reminder';
        }

        return { ...client, category, daysLeft };
      })
      .filter(client => {
        // Only show clients that need messaging (within 15 days or expired)
        return client.daysLeft <= 15;
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [clients, settings.messageFrequency]);

  const filteredClients = useMemo(() => {
    if (activeFilter === 'all') return messagableClients;
    return messagableClients.filter(client => client.category === activeFilter);
  }, [messagableClients, activeFilter]);

  const counts = useMemo(() => ({
    all: messagableClients.length,
    expired: messagableClients.filter(c => c.category === 'expired').length,
    critical: messagableClients.filter(c => c.category === 'critical').length,
    reminder: messagableClients.filter(c => c.category === 'reminder').length,
  }), [messagableClients]);

  const getTemplate = (category: MessageCategory) => {
    switch (category) {
      case 'expired': return settings.templates.expired;
      case 'critical': return settings.templates.critical;
      case 'reminder': return settings.templates.reminder;
    }
  };

  const formatMessage = (template: string, client: ClientWithCategory) => {
    return template
      .replace(/{name}/g, client.name)
      .replace(/{website}/g, client.website)
      .replace(/{days}/g, Math.abs(client.daysLeft).toString())
      .replace(/{price}/g, client.price.toString())
      .replace(/{currency}/g, settings.currency);
  };

  const handleSendMessage = (client: ClientWithCategory) => {
    const template = getTemplate(client.category);
    const message = formatMessage(template, client);
    const phone = client.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    updateClient(client.id, { lastMessageSent: new Date().toISOString() });
    addActivityLog({ action: 'message_sent', clientName: client.name });
    toast.success(`Message opened for ${client.name}`);
  };

  const handleMarkAllSent = () => {
    filteredClients.forEach(client => {
      updateClient(client.id, { lastMessageSent: new Date().toISOString() });
    });
    toast.success('All messages marked as sent');
  };

  const getCategoryBadge = (category: MessageCategory) => {
    switch (category) {
      case 'expired':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Expired</Badge>;
      case 'critical':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Critical</Badge>;
      case 'reminder':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Reminder</Badge>;
    }
  };

  if (messagableClients.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Center</h1>
          <p className="text-muted-foreground">Send automated messages to your clients</p>
        </div>
        
        <Card className="shadow-card border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <PartyPopper className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No messages to send right now. All your clients are either on auto-pay 
              or have received messages recently.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Center</h1>
          <p className="text-muted-foreground">Send automated messages to your clients</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllSent}>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark All as Sent
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          All ({counts.all})
        </Button>
        <Button
          variant={activeFilter === 'expired' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('expired')}
          className={activeFilter === 'expired' ? '' : 'border-destructive/30 text-destructive hover:bg-destructive/10'}
        >
          Expired ({counts.expired})
        </Button>
        <Button
          variant={activeFilter === 'critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('critical')}
          className={activeFilter === 'critical' ? '' : 'border-warning/30 text-warning hover:bg-warning/10'}
        >
          Critical ({counts.critical})
        </Button>
        <Button
          variant={activeFilter === 'reminder' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('reminder')}
          className={activeFilter === 'reminder' ? '' : 'border-primary/30 text-primary hover:bg-primary/10'}
        >
          Reminder ({counts.reminder})
        </Button>
      </div>

      {/* Table */}
      <Card className="shadow-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Website</TableHead>
              <TableHead className="font-semibold">Days Left</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client, index) => (
              <TableRow 
                key={client.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{client.website}</TableCell>
                <TableCell>
                  <span className={cn(
                    "font-medium",
                    client.daysLeft < 0 ? "text-destructive" :
                    client.daysLeft <= 7 ? "text-warning" :
                    "text-foreground"
                  )}>
                    {client.daysLeft < 0 
                      ? `${Math.abs(client.daysLeft)} days overdue`
                      : `${client.daysLeft} days`}
                  </span>
                </TableCell>
                <TableCell>{getCategoryBadge(client.category)}</TableCell>
                <TableCell className="font-medium">
                  {settings.currency}{client.price.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => handleSendMessage(client)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
