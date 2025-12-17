import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Building2, 
  MessageSquare, 
  Database, 
  Download, 
  Upload, 
  Trash2,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, setSettings } = useApp();

  const handleAppNameChange = (value: string) => {
    setSettings(prev => ({ ...prev, appName: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setSettings(prev => ({ ...prev, currency: value }));
  };

  const handleGoalChange = (value: number) => {
    setSettings(prev => ({ ...prev, monthlyGoal: value }));
  };

  const handleFrequencyChange = (value: number) => {
    setSettings(prev => ({ ...prev, messageFrequency: value }));
  };

  const handleTemplateChange = (key: keyof typeof settings.templates, value: string) => {
    setSettings(prev => ({
      ...prev,
      templates: { ...prev.templates, [key]: value }
    }));
  };

  const handleBackup = () => {
    toast.success('Backup created successfully');
  };

  const handleRestore = () => {
    toast.info('Please select a backup file');
  };

  const handleClearLogs = () => {
    toast.success('All logs cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your application preferences</p>
      </div>

      {/* App Identity */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            App Identity
          </CardTitle>
          <CardDescription>
            Basic settings for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                value={settings.appName}
                onChange={(e) => handleAppNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Symbol</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Monthly Goal</Label>
              <Input
                id="goal"
                type="number"
                value={settings.monthlyGoal}
                onChange={(e) => handleGoalChange(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Razorpay Config */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Razorpay Configuration
          </CardTitle>
          <CardDescription>
            Connect your Razorpay account for auto-sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razorpayKey">API Key ID</Label>
              <Input
                id="razorpayKey"
                type="password"
                placeholder="rzp_live_xxxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpaySecret">API Secret</Label>
              <Input
                id="razorpaySecret"
                type="password"
                placeholder="••••••••••••"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              readOnly
              value="https://your-domain.com/api/razorpay-webhook"
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Add this URL to your Razorpay webhook settings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Templates */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            WhatsApp Templates
          </CardTitle>
          <CardDescription>
            Customize message templates. Use variables: {'{name}'}, {'{website}'}, {'{days}'}, {'{price}'}, {'{currency}'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminderTemplate">Reminder Message (8-15 days)</Label>
            <Textarea
              id="reminderTemplate"
              value={settings.templates.reminder}
              onChange={(e) => handleTemplateChange('reminder', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criticalTemplate">Critical Message (1-7 days)</Label>
            <Textarea
              id="criticalTemplate"
              value={settings.templates.critical}
              onChange={(e) => handleTemplateChange('critical', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiredTemplate">Expired Message</Label>
            <Textarea
              id="expiredTemplate"
              value={settings.templates.expired}
              onChange={(e) => handleTemplateChange('expired', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeTemplate">Welcome Message</Label>
            <Textarea
              id="welcomeTemplate"
              value={settings.templates.welcome}
              onChange={(e) => handleTemplateChange('welcome', e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Message Frequency (days)</Label>
            <Input
              id="frequency"
              type="number"
              value={settings.messageFrequency}
              onChange={(e) => handleFrequencyChange(Number(e.target.value))}
              min={1}
              max={30}
              className="w-24"
            />
            <p className="text-xs text-muted-foreground">
              Clients won't appear in WhatsApp Center for this many days after receiving a message
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup & Restore
          </CardTitle>
          <CardDescription>
            Manage your data backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleBackup}>
              <Download className="w-4 h-4 mr-2" />
              Download Backup (JSON)
            </Button>
            <Button variant="outline" onClick={handleBackup}>
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={handleRestore}>
              <Upload className="w-4 h-4 mr-2" />
              Restore Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="shadow-card border border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Logs
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will delete Message Logs, Webhook Logs, and Activity Logs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
