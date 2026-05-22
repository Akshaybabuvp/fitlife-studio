'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Pencil,
  Trash2,
  ShieldOff,
  ShieldCheck,
  MapPin,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import type { MemberWithFeeStatus } from '@/types';
import { formatDate, daysUntilExpiry } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/cn';

interface Props {
  member: MemberWithFeeStatus;
  index: number;
  onDelete: () => void;
  onSuspend: () => void;
}

export default function MemberCard({
  member,
  index,
  onDelete,
  onSuspend,
}: Props) {
  const days = daysUntilExpiry(member.expiry_date);
  const isExpired = member.fee_status === 'expired';
  const isExpiring = member.fee_status === 'expiring_soon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'bg-zinc-900 border rounded-2xl p-4 space-y-3 transition-colors',
        isExpired
          ? 'border-red-900/50 bg-red-950/10'
          : isExpiring
            ? 'border-yellow-900/40 bg-yellow-950/5'
            : 'border-zinc-800',
      )}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 flex-shrink-0">
          {member.profile_image ? (
            <Image
              src={member.profile_image}
              alt={member.full_name}
              fill
              className="rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-zinc-700 rounded-xl flex items-center justify-center text-base font-bold text-zinc-300">
              {member.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name + Status */}
        <div className="flex-1 min-w-0">
          <Link href={`/members/${member.id}`}>
            <p className="text-white font-semibold truncate hover:text-red-300 transition-colors">
              {member.full_name}
            </p>
          </Link>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                isExpired
                  ? 'bg-red-600/15 text-red-400 border-red-600/20'
                  : isExpiring
                    ? 'bg-yellow-600/15 text-yellow-400 border-yellow-600/20'
                    : 'bg-green-600/15 text-green-400 border-green-600/20',
              )}
            >
              {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : 'Active'}
            </span>
            {member.status === 'suspended' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-zinc-700/50 text-zinc-400 border-zinc-700">
                Suspended
              </span>
            )}
          </div>
        </div>

        {/* Fee */}
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold text-base">
            {formatCurrency(member.fee_amount)}
          </p>
          <p
            className={cn(
              'text-xs',
              isExpired
                ? 'text-red-400'
                : isExpiring
                  ? 'text-yellow-400'
                  : 'text-zinc-500',
            )}
          >
            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
          </p>
        </div>
      </div>

      {/* Details row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3" /> {member.phone}
        </span>
        {member.address && (
          <span className="flex items-center gap-1 truncate max-w-[160px]">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {member.address}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Expires{' '}
          {formatDate(member.expiry_date)}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
        <a
          href={`tel:${member.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 text-green-400 text-xs font-semibold py-2 rounded-xl transition-all"
        >
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
        <Link
          href={`/members/edit/${member.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold py-2 rounded-xl transition-all"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </Link>
        <button
          onClick={onSuspend}
          className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-600/20 text-yellow-400 text-xs font-semibold py-2 rounded-xl transition-all"
        >
          {member.status === 'suspended' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5" /> Activate
            </>
          ) : (
            <>
              <ShieldOff className="w-3.5 h-3.5" /> Suspend
            </>
          )}
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 rounded-xl transition-all flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
