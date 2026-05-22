'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'red' | 'green' | 'blue' | 'yellow' | 'zinc';
}

const colorMap = {
  red: {
    bg: 'bg-red-600/10',
    border: 'border-red-600/20',
    icon: 'text-red-500',
    value: 'text-red-400',
  },
  green: {
    bg: 'bg-green-600/10',
    border: 'border-green-600/20',
    icon: 'text-green-500',
    value: 'text-green-400',
  },
  blue: {
    bg: 'bg-blue-600/10',
    border: 'border-blue-600/20',
    icon: 'text-blue-500',
    value: 'text-blue-400',
  },
  yellow: {
    bg: 'bg-yellow-600/10',
    border: 'border-yellow-600/20',
    icon: 'text-yellow-500',
    value: 'text-yellow-400',
  },
  zinc: {
    bg: 'bg-zinc-700/30',
    border: 'border-zinc-700/50',
    icon: 'text-zinc-400',
    value: 'text-white',
  },
};

export default function StatsCard({ title, value, icon: Icon, color }: Props) {
  const c = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 sm:p-5 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-zinc-500 text-xs sm:text-sm font-medium truncate">
            {title}
          </p>
          <p
            className={cn(
              'text-xl sm:text-2xl font-bold mt-1.5 truncate',
              c.value,
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border',
            c.bg,
            c.border,
          )}
        >
          <Icon className={cn('w-5 h-5', c.icon)} />
        </div>
      </div>
    </motion.div>
  );
}
