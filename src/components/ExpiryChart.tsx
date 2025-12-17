import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { differenceInDays, format, addDays, startOfDay } from 'date-fns';

export function ExpiryChart() {
  const { clients } = useApp();

  // Group clients by expiry date within next 15 days
  const today = startOfDay(new Date());
  const chartData = [];

  for (let i = 0; i <= 15; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'MMM d');
    const count = clients.filter(client => {
      const expiryDate = startOfDay(new Date(client.expiryDate));
      return differenceInDays(expiryDate, today) === i;
    }).length;

    if (count > 0 || i <= 7) {
      chartData.push({
        date: dateStr,
        count,
        daysLeft: i,
      });
    }
  }

  const getBarColor = (daysLeft: number) => {
    if (daysLeft <= 0) return 'hsl(var(--destructive))';
    if (daysLeft <= 3) return 'hsl(var(--warning))';
    if (daysLeft <= 7) return 'hsl(var(--chart-3))';
    return 'hsl(var(--success))';
  };

  return (
    <Card className="shadow-card border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Expiry Timeline</CardTitle>
        <p className="text-sm text-muted-foreground">Clients expiring in the next 15 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`${value} client${value !== 1 ? 's' : ''}`, 'Expiring']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.daysLeft)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">Expired</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-muted-foreground">Critical (1-3 days)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-muted-foreground">Safe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
