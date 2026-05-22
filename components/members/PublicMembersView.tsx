'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Users,
  Dumbbell,
  MapPin,
  Phone,
  Calendar,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import type { Member, MemberWithFeeStatus } from '@/types';
import { getFeeStatus, formatDate, daysUntilExpiry } from '@/utils/date';
import { cn } from '@/utils/cn';

interface Props {
  initialMembers: Member[];
}

export default function PublicMembersView({ initialMembers }: Props) {
  const [search, setSearch] = useState('');

  const withStatus: MemberWithFeeStatus[] = useMemo(
    () =>
      initialMembers.map((m) => ({
        ...m,
        fee_status: getFeeStatus(m.expiry_date),
      })),
    [initialMembers],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return withStatus;
    const q = search.toLowerCase();
    return withStatus.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        (m.address ?? '').toLowerCase().includes(q),
    );
  }, [withStatus, search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              FitLife Studio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-zinc-800"
            >
              Home
            </Link>
            <Link
              href="/members"
              className="px-4 py-2 text-white text-sm font-medium transition-colors rounded-lg bg-zinc-800"
            >
              Members
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-zinc-800"
            >
              Dashboard
            </Link>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Login</span>
            <span className="sm:hidden">Login</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Members</h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              {withStatus.length} members · FitLife Studio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-zinc-400 text-xs font-medium">
                {withStatus.filter((m) => m.status === 'active').length} Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search members by name, phone or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-medium">No members found</p>
            <p className="text-zinc-600 text-sm mt-1">
              Try a different search term
            </p>
          </motion.div>
        )}

        {/* Desktop Table */}
        {filtered.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {[
                        'Member',
                        'Phone',
                        'Address',
                        'Joined',
                        'Expires',
                        'Status',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <AnimatePresence>
                      {filtered.map((member, i) => (
                        <PublicTableRow
                          key={member.id}
                          member={member}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              <AnimatePresence>
                {filtered.map((member, i) => (
                  <PublicMobileCard key={member.id} member={member} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Desktop Table Row ──
function PublicTableRow({
  member,
  index,
}: {
  member: MemberWithFeeStatus;
  index: number;
}) {
  const days = daysUntilExpiry(member.expiry_date);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.03 }}
      className={cn(
        'hover:bg-zinc-800/40 transition-colors',
        member.fee_status === 'expired' && 'bg-red-950/10',
        member.fee_status === 'expiring_soon' && 'bg-yellow-950/10',
      )}
    >
      {/* Member */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            {member.profile_image ? (
              <Image
                src={member.profile_image}
                alt={member.full_name}
                fill
                className="rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-300">
                {member.full_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">
              {member.full_name}
            </p>
            <p className="text-zinc-500 text-xs capitalize">
              {member.gender ?? '—'}
            </p>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3.5">
        <a
          href={`tel:${member.phone}`}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-zinc-600" />
          {member.phone}
        </a>
      </td>

      {/* Address */}
      <td className="px-4 py-3.5">
        <span className="text-zinc-400 text-sm">{member.address ?? '—'}</span>
      </td>

      {/* Joined */}
      <td className="px-4 py-3.5">
        <span className="text-zinc-400 text-sm">
          {formatDate(member.join_date)}
        </span>
      </td>

      {/* Expires */}
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

      {/* Status */}
      <td className="px-4 py-3.5">
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border',
            member.fee_status === 'active'
              ? 'bg-green-600/15 text-green-400 border-green-600/20'
              : member.fee_status === 'expiring_soon'
                ? 'bg-yellow-600/15 text-yellow-400 border-yellow-600/20'
                : 'bg-red-600/15 text-red-400 border-red-600/20',
          )}
        >
          {member.fee_status === 'expiring_soon'
            ? 'Expiring'
            : member.fee_status === 'expired'
              ? 'Expired'
              : 'Active'}
        </span>
      </td>
    </motion.tr>
  );
}

// ── Mobile Card ──
function PublicMobileCard({
  member,
  index,
}: {
  member: MemberWithFeeStatus;
  index: number;
}) {
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
        'bg-zinc-900 border rounded-2xl p-4 space-y-3',
        isExpired
          ? 'border-red-900/50 bg-red-950/10'
          : isExpiring
            ? 'border-yellow-900/40 bg-yellow-950/5'
            : 'border-zinc-800',
      )}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          {member.profile_image ? (
            <Image
              src={member.profile_image}
              alt={member.full_name}
              fill
              className="rounded-xl object-cover"
              unoptimized
            />
          ) : (
            <div className="w-12 h-12 bg-zinc-700 rounded-xl flex items-center justify-center text-base font-bold text-zinc-300">
              {member.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            {member.full_name}
          </p>
          <span
            className={cn(
              'inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5',
              isExpired
                ? 'bg-red-600/15 text-red-400 border-red-600/20'
                : isExpiring
                  ? 'bg-yellow-600/15 text-yellow-400 border-yellow-600/20'
                  : 'bg-green-600/15 text-green-400 border-green-600/20',
            )}
          >
            {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : 'Active'}
          </span>
        </div>

        <div className="text-right flex-shrink-0">
          <p
            className={cn(
              'text-xs font-semibold',
              isExpired
                ? 'text-red-400'
                : isExpiring
                  ? 'text-yellow-400'
                  : 'text-zinc-400',
            )}
          >
            {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
          </p>
          <p className="text-zinc-500 text-xs mt-0.5">
            {formatDate(member.expiry_date)}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 pt-1 border-t border-zinc-800">
        <a
          href={`tel:${member.phone}`}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Phone className="w-3 h-3" /> {member.phone}
        </a>
        {member.address && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {member.address}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Joined {formatDate(member.join_date)}
        </span>
      </div>
    </motion.div>
  );
}
