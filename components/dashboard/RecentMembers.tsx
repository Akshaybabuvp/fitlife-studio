'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import type { Member } from '@/types';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

interface Props {
  members: Member[];
}

export default function RecentMembers({ members }: Props) {
  if (members.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-base mb-4">
          Recent Members
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-zinc-500 text-sm">No members yet</p>
          <Link
            href="/members/add"
            className="text-red-400 text-sm mt-2 hover:text-red-300"
          >
            Add your first member →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-semibold text-base">Recent Members</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Latest additions</p>
        </div>
        <Link
          href="/members"
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors"
          >
            {/* Avatar */}
            <div className="w-9 h-9 bg-red-600/20 border border-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-red-400">
              {member.full_name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/members/${member.id}`}>
                <p className="text-white text-sm font-medium truncate hover:text-red-300 transition-colors">
                  {member.full_name}
                </p>
              </Link>
              <p className="text-zinc-500 text-xs mt-0.5">
                Joined {formatDate(member.join_date)}
              </p>
            </div>

            {/* Status + Call */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  member.status === 'active'
                    ? 'bg-green-600/15 text-green-400'
                    : 'bg-zinc-700 text-zinc-400',
                )}
              >
                {member.status}
              </span>
              <a
                href={`tel:${member.phone}`}
                className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5 text-zinc-300" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
