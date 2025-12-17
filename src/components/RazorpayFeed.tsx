import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CreditCard, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Mock unmanaged subscriptions data
const unmanagedSubscriptions = [
  {
    id: 'sub_123',
    email: 'new.customer@email.com',
    plan: 'Basic Plan',
    amount: 1999,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 'sub_456',
    email: 'another.user@email.com',
    plan: 'Premium Plan',
    amount: 3999,
    status: 'active',
    createdAt: '2024-01-14',
  },
];

export function RazorpayFeed() {
  const handleSync = () => {
    toast.info('Syncing Razorpay data...', { duration: 2000 });
    setTimeout(() => {
      toast.success('Data synced successfully');
    }, 2000);
  };

  const handleAddDetails = (subscriptionId: string) => {
    toast.info(`Opening details form for subscription ${subscriptionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Razorpay Feed</h1>
          <p className="text-muted-foreground">Manage unlinked Razorpay subscriptions</p>
        </div>
        <Button variant="outline" onClick={handleSync}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Data
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Unmanaged Subscriptions</p>
            <p className="text-sm text-muted-foreground">
              These are new Razorpay subscriptions that haven't been linked to clients in your database. 
              Click "Add Details" to complete the client profile.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="grid gap-4">
        {unmanagedSubscriptions.length === 0 ? (
          <Card className="shadow-card border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Unmanaged Subscriptions</h3>
              <p className="text-muted-foreground text-center">
                All Razorpay subscriptions are linked to clients
              </p>
            </CardContent>
          </Card>
        ) : (
          unmanagedSubscriptions.map((sub) => (
            <Card key={sub.id} className="shadow-card border hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{sub.email}</p>
                      <p className="text-sm text-muted-foreground">{sub.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">₹{sub.amount.toLocaleString()}</p>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {sub.status}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => handleAddDetails(sub.id)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
