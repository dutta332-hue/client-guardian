import React, { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, CheckCircle, AlertTriangle, Globe } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export function WebsiteRenewals() {
  const { clients, updateClient } = useApp();

  // Find clients where payment was made (autoPay) but website expiry is old
  const renewalNeeded = useMemo(() => {
    return clients.filter(client => {
      if (!client.autoPay) return false;
      const daysLeft = differenceInDays(new Date(client.expiryDate), new Date());
      return daysLeft < 0;
    });
  }, [clients]);

  const handleMarkRenewed = (clientId: string, clientName: string) => {
    // Update expiry date to 1 year from now
    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
    
    updateClient(clientId, {
      expiryDate: newExpiryDate.toISOString(),
      status: 'active',
    });
    
    toast.success(`Website renewed for ${clientName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Website Renewals</h1>
        <p className="text-muted-foreground">
          Clients with auto-pay whose websites need manual renewal
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-warning/5 border-warning/20">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium">Action Required</p>
            <p className="text-sm text-muted-foreground">
              These clients have auto-pay enabled and payment was deducted, but the website 
              hosting expiry date hasn't been updated. Please renew the hosting manually.
            </p>
          </div>
        </CardContent>
      </Card>

      {renewalNeeded.length === 0 ? (
        <Card className="shadow-card border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">All Websites Renewed</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No pending website renewals. All auto-pay clients have up-to-date expiry dates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Website</TableHead>
                <TableHead className="font-semibold">Expired On</TableHead>
                <TableHead className="font-semibold">Days Overdue</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewalNeeded.map((client, index) => {
                const daysOverdue = Math.abs(differenceInDays(new Date(client.expiryDate), new Date()));
                return (
                  <TableRow 
                    key={client.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.website}
                    </TableCell>
                    <TableCell>
                      {format(new Date(client.expiryDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        {daysOverdue} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleMarkRenewed(client.id, client.name)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
