'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  TrendingUp,
  CalendarX,
  AlertTriangle,
  UserX,
} from 'lucide-react';
import type { Member, Payment } from '@/types';
import { getFeeStatus, formatDate, getLast6Months } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import ExpiringTable from './ExpiringTable';
import RecentMembers from './RecentMembers';

interface Props {
  initialMembers: Member[];
  initialPayments: Payment[];
}

export default function DashboardClient({
  initialMembers,
  initialPayments,
}: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();

    const active = initialMembers.filter((m) => m.status === 'active').length;
    const suspended = initialMembers.filter(
      (m) => m.status === 'suspended',
    ).length;
    const expired = initialMembers.filter(
      (m) => getFeeStatus(m.expiry_date) === 'expired',
    ).length;
    const expiringSoon = initialMembers.filter(
      (m) => getFeeStatus(m.expiry_date) === 'expiring_soon',
    ).length;

    const monthlyProfit = initialPayments
      .filter((p) => p.paid_at >= monthStart)
      .reduce((s, p) => s + Number(p.amount), 0);

    const yearlyProfit = initialPayments
      .filter((p) => p.paid_at >= yearStart)
      .reduce((s, p) => s + Number(p.amount), 0);

    return {
      active,
      suspended,
      expired,
      expiringSoon,
      monthlyProfit,
      yearlyProfit,
    };
  }, [initialMembers, initialPayments]);

  const chartData = useMemo(() => {
    const months = getLast6Months();
    return months.map(({ label, key }) => {
      const revenue = initialPayments
        .filter((p) => p.paid_at.startsWith(key))
        .reduce((s, p) => s + Number(p.amount), 0);
      const members = initialMembers.filter((m) =>
        m.join_date.startsWith(key),
      ).length;
      return { month: label, revenue, members };
    });
  }, [initialMembers, initialPayments]);

  const expiringMembers = useMemo(
    () =>
      initialMembers
        .filter(
          (m) =>
            getFeeStatus(m.expiry_date) === 'expiring_soon' ||
            getFeeStatus(m.expiry_date) === 'expired',
        )
        .slice(0, 8),
    [initialMembers],
  );

  const recentMembers = useMemo(
    () => initialMembers.slice(0, 5),
    [initialMembers],
  );

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          FitLife Studio · Panambad, Maranchery
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        {...fadeUp(0.05)}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        <StatsCard
          title="Total Members"
          value={initialMembers.length}
          icon={Users}
          color="zinc"
        />
        <StatsCard
          title="Active Members"
          value={stats.active}
          icon={UserCheck}
          color="green"
        />
        <StatsCard
          title="Monthly Profit"
          value={formatCurrency(stats.monthlyProfit)}
          icon={TrendingUp}
          color="red"
        />
        <StatsCard
          title="Yearly Profit"
          value={formatCurrency(stats.yearlyProfit)}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          title="Expired Fees"
          value={stats.expired}
          icon={CalendarX}
          color="red"
        />
      </motion.div>

      {/* Chart */}
      <motion.div {...fadeUp(0.1)}>
        <RevenueChart data={chartData} />
      </motion.div>

      {/* Bottom Grid */}
      <motion.div {...fadeUp(0.15)} className="grid lg:grid-cols-2 gap-4">
        <ExpiringTable members={expiringMembers} />
        <RecentMembers members={recentMembers} />
      </motion.div>
    </div>
  );
}
