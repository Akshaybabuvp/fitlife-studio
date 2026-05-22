'use client';

import Link from 'next/link';
import { AlertTriangle, CalendarX, ArrowRight } from 'lucide-react';
import type { Member } from '@/types';
import { getFeeStatus, formatDate, daysUntilExpiry } from '@/utils/date';
import { cn } from '@/utils/cn';

interface Props {
  members: Member[];
}

export default function ExpiringTable({ members }: Props) {
  if (members.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-base mb-4">Fee Alerts</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 bg-green-600/10 border border-green-600/20 rounded-xl flex items-center justify-center mb-3">
            <CalendarX className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-zinc-400 text-sm">All fees are up to date</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-semibold text-base">Fee Alerts</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            Expiring & expired members
          </p>
        </div>
        <Link
          href="/members"
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {members.map((member) => {
          const status = getFeeStatus(member.expiry_date);
          const days = daysUntilExpiry(member.expiry_date);
          const isExpired = status === 'expired';

          return (
            <Link key={member.id} href={`/members/${member.id}`}>
              <div
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-colors hover:border-zinc-600',
                  isExpired
                    ? 'bg-red-600/5 border-red-600/20'
                    : 'bg-yellow-600/5 border-yellow-600/20',
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold',
                    isExpired
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-yellow-600/20 text-yellow-400',
                  )}
                >
                  {member.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {member.full_name}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Expires {formatDate(member.expiry_date)}
                  </p>
                </div>

                {/* Badge */}
                <div
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0',
                    isExpired
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-yellow-600/20 text-yellow-400',
                  )}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {isExpired ? `${Math.abs(days)}d ago` : `${days}d left`}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
