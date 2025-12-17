import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Client, FilterType } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ClientDialog } from './ClientDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink,
  Zap,
  Filter
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'critical', label: 'Critical' },
  { value: 'expired', label: 'Expired' },
];

export function ClientTable() {
  const { clients, deleteClient, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        client.name.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchQuery) ||
        client.website.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter
      if (filter === 'all') return true;
      return client.status === filter;
    });
  }, [clients, searchQuery, filter]);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const getDaysLeft = (expiryDate: string) => {
    return differenceInDays(new Date(expiryDate), new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Customers</h1>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <Button variant="gradient" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or website..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                  className="whitespace-nowrap"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Website</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Expiry</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Auto-Pay</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client, index) => {
                const daysLeft = getDaysLeft(client.expiryDate);
                return (
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
                    <TableCell>
                      <a 
                        href={`https://${client.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {client.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">
                      {settings.currency}{client.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{format(new Date(client.expiryDate), 'MMM d, yyyy')}</p>
                        <p className={cn(
                          "text-xs",
                          daysLeft < 0 ? "text-destructive" :
                          daysLeft <= 7 ? "text-warning" :
                          "text-muted-foreground"
                        )}>
                          {daysLeft < 0 
                            ? `${Math.abs(daysLeft)} days overdue`
                            : daysLeft === 0 
                            ? 'Expires today'
                            : `${daysLeft} days left`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={client.status} />
                    </TableCell>
                    <TableCell>
                      {client.autoPay ? (
                        <Badge className="bg-accent/10 text-accent border-accent/20">
                          <Zap className="w-3 h-3 mr-1" />
                          AP
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          OFF
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(client)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteClient(client.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <ClientDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        client={editingClient}
      />
    </div>
  );
}
