import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  website: string;
  price: number;
  expiryDate: string;
  status: 'active' | 'critical' | 'expired' | 'pending';
  autoPay: boolean;
  notes: string;
}

export function ClientDialog({ open, onOpenChange, client }: ClientDialogProps) {
  const { addClient, updateClient, clients } = useApp();
  const isEditing = !!client;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      website: '',
      price: 0,
      expiryDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'active',
      autoPay: false,
      notes: '',
    },
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        phone: client.phone,
        email: client.email || '',
        website: client.website,
        price: client.price,
        expiryDate: format(new Date(client.expiryDate), 'yyyy-MM-dd'),
        status: client.status,
        autoPay: client.autoPay,
        notes: client.notes || '',
      });
    } else {
      reset({
        name: '',
        phone: '',
        email: '',
        website: '',
        price: 0,
        expiryDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'active',
        autoPay: false,
        notes: '',
      });
    }
  }, [client, reset]);

  const onSubmit = (data: FormData) => {
    // Check for duplicates
    const isDuplicate = clients.some(c => 
      c.id !== client?.id && 
      (c.phone === data.phone || c.website.toLowerCase() === data.website.toLowerCase())
    );

    if (isDuplicate) {
      toast.error('A client with this phone number or website already exists');
      return;
    }

    if (isEditing && client) {
      updateClient(client.id, {
        ...data,
        expiryDate: new Date(data.expiryDate).toISOString(),
      });
      toast.success('Client updated successfully');
    } else {
      addClient({
        ...data,
        expiryDate: new Date(data.expiryDate).toISOString(),
      });
      toast.success('Client added successfully');
    }
    onOpenChange(false);
  };

  const autoPay = watch('autoPay');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the client information below.' : 'Fill in the details to add a new client.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Phone is required' })}
                placeholder="+1234567890"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website *</Label>
            <Input
              id="website"
              {...register('website', { required: 'Website is required' })}
              placeholder="example.com"
            />
            {errors.website && (
              <p className="text-xs text-destructive">{errors.website.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { required: 'Price is required', valueAsNumber: true })}
                placeholder="2500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                {...register('expiryDate', { required: 'Expiry date is required' })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: FormData['status']) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Auto-Pay</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={autoPay}
                  onCheckedChange={(checked) => setValue('autoPay', checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {autoPay ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this client..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {isEditing ? 'Update Client' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
