'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats, MonthlyRevenue, Member } from '@/types';
import {
  getFeeStatus,
  getLast6Months,
  getCurrentMonthRange,
  getCurrentYearRange,
} from '@/utils/date';
import { useSupabase } from './useSupabase';

export function useDashboard() {
  const supabase = useSupabase();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);

    const { data: members } = await supabase.from('members').select('*');
    if (!members) {
      setLoading(false);
      return;
    }

    const all = members as Member[];
    const { start: mStart, end: mEnd } = getCurrentMonthRange();
    const { start: yStart, end: yEnd } = getCurrentYearRange();

    const [{ data: mPay }, { data: yPay }] = await Promise.all([
      supabase
        .from('payments')
        .select('amount')
        .gte('paid_at', mStart)
        .lte('paid_at', mEnd),
      supabase
        .from('payments')
        .select('amount')
        .gte('paid_at', yStart)
        .lte('paid_at', yEnd),
    ]);

    const monthlyProfit = (mPay ?? []).reduce((s, p) => s + p.amount, 0);
    const yearlyProfit = (yPay ?? []).reduce((s, p) => s + p.amount, 0);

    setStats({
      totalMembers: all.length,
      activeMembers: all.filter((m) => m.status === 'active').length,
      suspendedMembers: all.filter((m) => m.status === 'suspended').length,
      monthlyProfit,
      yearlyProfit,
      expiringThisWeek: all.filter(
        (m) => getFeeStatus(m.expiry_date) === 'expiring_soon',
      ).length,
      expiredMembers: all.filter(
        (m) => getFeeStatus(m.expiry_date) === 'expired',
      ).length,
    });

    const months = getLast6Months();
    const chartData: MonthlyRevenue[] = await Promise.all(
      months.map(async ({ label, key }) => {
        const { data: pData } = await supabase
          .from('payments')
          .select('amount')
          .gte('paid_at', `${key}-01`)
          .lte('paid_at', `${key}-31`);

        const revenue = (pData ?? []).reduce((s, p) => s + p.amount, 0);
        const membersJoined = all.filter((m) =>
          m.join_date.startsWith(key),
        ).length;
        return { month: label, revenue, members: membersJoined };
      }),
    );

    setMonthlyData(chartData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, monthlyData, loading, refetch: fetchStats };
}
