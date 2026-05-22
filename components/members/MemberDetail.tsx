'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Pencil,
  Trash2,
  ShieldOff,
  ShieldCheck,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import type { Member, Payment } from '@/types';
import { getFeeStatus, formatDate, daysUntilExpiry } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/cn';
import DeleteMemberDialog from './DeleteMemberDialog';
import SuspendMemberDialog from './SuspendMemberDialog';

interface Props {
  member: Member;
  payments: Payment[];
}

export default function MemberDetail({
  member: initialMember,
  payments,
}: Props) {
  const router = useRouter();
  const [member, setMember] = useState(initialMember);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const feeStatus = getFeeStatus(member.expiry_date);
  const days = daysUntilExpiry(member.expiry_date);

  const statusConfig = {
    active: {
      label: 'Active',
      icon: CheckCircle,
      classes: 'bg-green-600/15 text-green-400 border-green-600/20',
    },
    expiring_soon: {
      label: 'Expiring Soon',
      icon: Clock,
      classes: 'bg-yellow-600/15 text-yellow-400 border-yellow-600/20',
    },
    expired: {
      label: 'Expired',
      icon: XCircle,
      classes: 'bg-red-600/15 text-red-400 border-red-600/20',
    },
  };

  const sc = statusConfig[feeStatus];

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4, ease: 'easeOut' },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-4">
        <Link
          href="/members"
          className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Member Profile</h1>
          <p className="text-zinc-500 text-sm">Full member details</p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        {...fadeUp(0.05)}
        className={cn(
          'bg-zinc-900 border rounded-2xl p-6',
          feeStatus === 'expired'
            ? 'border-red-900/50'
            : feeStatus === 'expiring_soon'
              ? 'border-yellow-900/40'
              : 'border-zinc-800',
        )}
      >
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.profile_image ? (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-700">
                <Image
                  src={member.profile_image}
                  alt={member.full_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-zinc-700 border-2 border-zinc-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-black text-zinc-300">
                  {member.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {member.full_name}
                </h2>
                <p className="text-zinc-500 text-sm capitalize mt-0.5">
                  {member.gender ?? 'Gender not set'}
                </p>
              </div>

              {/* Fee Status Badge */}
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold',
                  sc.classes,
                )}
              >
                <sc.icon className="w-4 h-4" />
                {sc.label}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-zinc-800/60 rounded-xl p-3">
                <p className="text-zinc-500 text-xs">Fee Amount</p>
                <p className="text-white font-bold text-lg mt-0.5">
                  {formatCurrency(member.fee_amount)}
                </p>
              </div>
              <div className="bg-zinc-800/60 rounded-xl p-3">
                <p className="text-zinc-500 text-xs">
                  Days {days < 0 ? 'Overdue' : 'Remaining'}
                </p>
                <p
                  className={cn(
                    'font-bold text-lg mt-0.5',
                    days < 0
                      ? 'text-red-400'
                      : days <= 7
                        ? 'text-yellow-400'
                        : 'text-white',
                  )}
                >
                  {Math.abs(days)}d
                </p>
              </div>
              <div className="bg-zinc-800/60 rounded-xl p-3">
                <p className="text-zinc-500 text-xs">Member Status</p>
                <p
                  className={cn(
                    'font-bold text-sm mt-0.5 capitalize',
                    member.status === 'active'
                      ? 'text-green-400'
                      : 'text-zinc-400',
                  )}
                >
                  {member.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-zinc-800">
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-2 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 text-green-400 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
          <Link
            href={`/members/edit/${member.id}`}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={() => setSuspendOpen(true)}
            className="flex items-center gap-2 bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-600/20 text-yellow-400 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            {member.status === 'suspended' ? (
              <>
                <ShieldCheck className="w-4 h-4" /> Reactivate
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4" /> Suspend
              </>
            )}
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-400 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </motion.div>

      {/* Details Grid */}
      <motion.div {...fadeUp(0.1)} className="grid sm:grid-cols-2 gap-4">
        {/* Contact & Personal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Contact & Personal
          </h3>
          <DetailRow icon={Phone} label="Phone" value={member.phone} isPhone />
          <DetailRow
            icon={MapPin}
            label="Address"
            value={member.address ?? '—'}
          />
          <DetailRow
            icon={User}
            label="Gender"
            value={member.gender ?? '—'}
            capitalize
          />
        </div>

        {/* Membership */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Membership
          </h3>
          <DetailRow
            icon={Calendar}
            label="Join Date"
            value={formatDate(member.join_date)}
          />
          <DetailRow
            icon={Calendar}
            label="Expiry Date"
            value={formatDate(member.expiry_date)}
          />
          <DetailRow
            icon={Calendar}
            label="Next Payment"
            value={
              member.next_payment_date
                ? formatDate(member.next_payment_date)
                : '—'
            }
          />
          <DetailRow
            icon={CreditCard}
            label="Payment Method"
            value={member.payment_method?.toUpperCase() ?? '—'}
          />
        </div>
      </motion.div>

      {/* Notes */}
      {member.notes && (
        <motion.div
          {...fadeUp(0.15)}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
        >
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Notes
          </h3>
          <div className="flex gap-3">
            <FileText className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
            <p className="text-zinc-300 text-sm leading-relaxed">
              {member.notes}
            </p>
          </div>
        </motion.div>
      )}

      {/* Payment History */}
      <motion.div
        {...fadeUp(0.2)}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
      >
        <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Payment History
        </h3>
        {payments.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-6">
            No payments recorded
          </p>
        ) : (
          <div className="space-y-2">
            {payments.map((payment, i) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600/15 border border-green-600/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-zinc-500 text-xs capitalize">
                      {payment.payment_method ?? 'cash'} ·{' '}
                      {formatDate(payment.paid_at)}
                    </p>
                  </div>
                </div>
                <span className="text-green-400 text-xs font-semibold bg-green-600/10 px-2.5 py-1 rounded-lg border border-green-600/20">
                  Paid
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Dialogs */}
      <DeleteMemberDialog
        member={deleteOpen ? member : null}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => router.push('/members')}
      />
      <SuspendMemberDialog
        member={suspendOpen ? member : null}
        onClose={() => setSuspendOpen(false)}
        onToggled={(updated) => {
          setMember(updated);
          setSuspendOpen(false);
        }}
      />
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  isPhone,
  capitalize,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isPhone?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-zinc-500" />
      </div>
      <div className="min-w-0">
        <p className="text-zinc-500 text-xs">{label}</p>
        {isPhone ? (
          <a
            href={`tel:${value}`}
            className="text-white text-sm font-medium hover:text-red-300 transition-colors"
          >
            {value}
          </a>
        ) : (
          <p
            className={cn(
              'text-white text-sm font-medium',
              capitalize && 'capitalize',
            )}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
