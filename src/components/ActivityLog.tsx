import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, Edit, Trash2, RotateCcw, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const actionIcons = {
  added: UserPlus,
  edited: Edit,
  deleted: Trash2,
  restored: RotateCcw,
  message_sent: MessageCircle,
};

const actionColors = {
  added: 'text-success bg-success/10',
  edited: 'text-primary bg-primary/10',
  deleted: 'text-destructive bg-destructive/10',
  restored: 'text-accent bg-accent/10',
  message_sent: 'text-warning bg-warning/10',
};

const actionLabels = {
  added: 'Added',
  edited: 'Edited',
  deleted: 'Deleted',
  restored: 'Restored',
  message_sent: 'Message sent',
};

export function ActivityLog() {
  const { activityLogs } = useApp();

  return (
    <Card className="shadow-card border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="px-6 pb-6 space-y-3">
            {activityLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activity yet
              </p>
            ) : (
              activityLogs.map((log, index) => {
                const Icon = actionIcons[log.action];
                return (
                  <div 
                    key={log.id} 
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      actionColors[log.action]
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        <span className="text-muted-foreground">{actionLabels[log.action]}:</span>{' '}
                        {log.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
