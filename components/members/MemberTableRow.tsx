'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Pencil, Trash2, ShieldOff, ShieldCheck } from 'lucide-react';
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

const feeStatusStyle = {
  active: 'bg-green-600/15 text-green-400 border-green-600/20',
  expiring_soon: 'bg-yellow-600/15 text-yellow-400 border-yellow-600/20',
  expired: 'bg-red-600/15 text-red-400 border-red-600/20',
};

export default function MemberTableRow({
  member,
  index,
  onDelete,
  onSuspend,
}: Props) {
  const days = daysUntilExpiry(member.expiry_date);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        'group hover:bg-zinc-800/40 transition-colors',
        member.fee_status === 'expired' && 'bg-red-950/10',
        member.fee_status === 'expiring_soon' && 'bg-yellow-950/10',
      )}
    >
      {/* Member */}
      <td className="px-4 py-3.5">
        <Link
          href={`/members/${member.id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-9 h-9 flex-shrink-0">
            {member.profile_image ? (
              <Image
                src={member.profile_image}
                alt={member.full_name}
                fill
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-zinc-700 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-300">
                {member.full_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate max-w-[140px]">
              {member.full_name}
            </p>

            <p className="text-zinc-500 text-xs capitalize">
              {member.gender ?? '—'}
            </p>
          </div>
        </Link>
      </td>

      {/* Phone */}
      <td className="px-4 py-3.5">
        <a
          href={`tel:${member.phone}`}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors group/phone"
        >
          <Phone className="w-3.5 h-3.5 text-zinc-600 group-hover/phone:text-red-400 transition-colors" />
          {member.phone}
        </a>
      </td>

      {/* Join Date */}
      <td className="px-4 py-3.5">
        <span className="text-zinc-400 text-sm">
          {formatDate(member.join_date)}
        </span>
      </td>

      {/* Expiry */}
      <td className="px-4 py-3.5">
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              member.fee_status === 'expired'
                ? 'text-red-400'
                : member.fee_status === 'expiring_soon'
                  ? 'text-yellow-400'
                  : 'text-zinc-300',
            )}
          >
            {formatDate(member.expiry_date)}
          </p>

          <p className="text-zinc-600 text-xs">
            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
          </p>
        </div>
      </td>

      {/* Fee */}
      <td className="px-4 py-3.5">
        <span className="text-zinc-300 text-sm font-medium">
          {formatCurrency(member.fee_amount)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border w-fit',
              feeStatusStyle[member.fee_status],
            )}
          >
            {member.fee_status === 'expiring_soon'
              ? 'Expiring'
              : member.fee_status}
          </span>

          {member.status === 'suspended' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border bg-zinc-700/50 text-zinc-400 border-zinc-700 w-fit">
              Suspended
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={`tel:${member.phone}`}
            className="w-8 h-8 bg-zinc-800 hover:bg-green-600/20 border border-zinc-700 hover:border-green-600/30 rounded-lg flex items-center justify-center transition-all"
            title="Call"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <Link
            href={`/members/edit/${member.id}`}
            className="w-8 h-8 bg-zinc-800 hover:bg-blue-600/20 border border-zinc-700 hover:border-blue-600/30 rounded-lg flex items-center justify-center transition-all"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            onClick={onSuspend}
            className="w-8 h-8 bg-zinc-800 hover:bg-yellow-600/20 border border-zinc-700 hover:border-yellow-600/30 rounded-lg flex items-center justify-center transition-all"
            title={member.status === 'suspended' ? 'Reactivate' : 'Suspend'}
          >
            {member.status === 'suspended' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            ) : (
              <ShieldOff className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          <button
            onClick={onDelete}
            className="w-8 h-8 bg-zinc-800 hover:bg-red-600/20 border border-zinc-700 hover:border-red-600/30 rounded-lg flex items-center justify-center transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
