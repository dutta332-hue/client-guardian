import React, { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, RotateCcw, AlertTriangle, Recycle } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export function TrashBin() {
  const { 
    trashedClients, 
    restoreClient, 
    permanentDeleteClient,
    clients,
    deleteClient 
  } = useApp();

  // Websites expired for more than 7 days
  const expiredWebsites = useMemo(() => {
    return clients.filter(client => {
      const daysExpired = differenceInDays(new Date(), new Date(client.expiryDate));
      return daysExpired > 7;
    });
  }, [clients]);

  const handleRestore = (id: string, name: string) => {
    restoreClient(id);
    toast.success(`${name} restored successfully`);
  };

  const handlePermanentDelete = (id: string, name: string) => {
    permanentDeleteClient(id);
    toast.success(`${name} permanently deleted`);
  };

  const handleDeleteExpired = (id: string, name: string) => {
    deleteClient(id);
    toast.success(`${name} moved to trash`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Trash & Danger Zone</h1>
        <p className="text-muted-foreground">Manage deleted clients and expired websites</p>
      </div>

      {/* Recycle Bin */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="w-5 h-5" />
            Recycle Bin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trashedClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Recycle bin is empty</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trashedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground">{client.website}</TableCell>
                    <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRestore(client.id, client.name)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Permanently Delete?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {client.name}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handlePermanentDelete(client.id, client.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Forever
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone - Expired Websites */}
      <Card className="shadow-card border border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Website Now
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Websites expired for more than 7 days. Consider removing these clients.
          </p>
        </CardHeader>
        <CardContent>
          {expiredWebsites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No critically expired websites</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiredWebsites.map((client) => {
                const daysExpired = differenceInDays(new Date(), new Date(client.expiryDate));
                return (
                  <div 
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.website}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-destructive/10 text-destructive">
                        {daysExpired} days overdue
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Client?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will move {client.name} to the recycle bin.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteExpired(client.id, client.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
