'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Users, Filter } from 'lucide-react';
import Link from 'next/link';
import type { Member, MemberWithFeeStatus } from '@/types';
import { getFeeStatus } from '@/utils/date';
import MemberCard from './MemberCard';
import MemberTableRow from './MemberTableRow';
import DeleteMemberDialog from './DeleteMemberDialog';
import SuspendMemberDialog from './SuspendMemberDialog';

type FilterType = 'all' | 'active' | 'suspended' | 'expired' | 'expiring_soon';

interface Props {
  initialMembers: Member[];
}

export default function MembersClient({ initialMembers }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const withStatus: MemberWithFeeStatus[] = useMemo(
    () =>
      members.map((m) => ({ ...m, fee_status: getFeeStatus(m.expiry_date) })),
    [members],
  );

  const filtered = useMemo(() => {
    let list = withStatus;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          (m.address ?? '').toLowerCase().includes(q),
      );
    }

    if (filter === 'active')
      list = list.filter(
        (m) => m.status === 'active' && m.fee_status === 'active',
      );
    if (filter === 'suspended')
      list = list.filter((m) => m.status === 'suspended');
    if (filter === 'expired')
      list = list.filter((m) => m.fee_status === 'expired');
    if (filter === 'expiring_soon')
      list = list.filter((m) => m.fee_status === 'expiring_soon');

    return list;
  }, [withStatus, search, filter]);

  const counts = useMemo(
    () => ({
      all: withStatus.length,
      active: withStatus.filter(
        (m) => m.status === 'active' && m.fee_status === 'active',
      ).length,
      suspended: withStatus.filter((m) => m.status === 'suspended').length,
      expired: withStatus.filter((m) => m.fee_status === 'expired').length,
      expiring_soon: withStatus.filter((m) => m.fee_status === 'expiring_soon')
        .length,
    }),
    [withStatus],
  );

  const handleDeleted = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDeleteTarget(null);
  };

  const handleSuspendToggled = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSuspendTarget(null);
  };

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: 'zinc' },
    { key: 'active', label: 'Active', color: 'green' },
    { key: 'expiring_soon', label: 'Expiring Soon', color: 'yellow' },
    { key: 'expired', label: 'Expired', color: 'red' },
    { key: 'suspended', label: 'Suspended', color: 'zinc' },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {withStatus.length} total members
          </p>
        </div>
        <Link
          href="/members/add"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-600/20 text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </Link>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, phone or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                filter === f.key
                  ? f.key === 'active'
                    ? 'bg-green-600/15 border-green-600/30 text-green-400'
                    : f.key === 'expiring_soon'
                      ? 'bg-yellow-600/15 border-yellow-600/30 text-yellow-400'
                      : f.key === 'expired'
                        ? 'bg-red-600/15 border-red-600/30 text-red-400'
                        : 'bg-zinc-700 border-zinc-600 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {f.label}
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px]">
                {counts[f.key]}
              </span>
            </button>
          ))}
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
            {search
              ? 'Try a different search term'
              : 'Add your first member to get started'}
          </p>
          {!search && (
            <Link
              href="/members/add"
              className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Add Member →
            </Link>
          )}
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
                      'Join Date',
                      'Expiry',
                      'Fee',
                      'Status',
                      'Actions',
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
                      <MemberTableRow
                        key={member.id}
                        member={member}
                        index={i}
                        onDelete={() => setDeleteTarget(member)}
                        onSuspend={() => setSuspendTarget(member)}
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
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i}
                  onDelete={() => setDeleteTarget(member)}
                  onSuspend={() => setSuspendTarget(member)}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Dialogs */}
      <DeleteMemberDialog
        member={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
      <SuspendMemberDialog
        member={suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onToggled={handleSuspendToggled}
      />
    </div>
  );
}
