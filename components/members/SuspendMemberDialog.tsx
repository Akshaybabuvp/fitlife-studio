'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldOff, ShieldCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Member } from '@/types';

interface Props {
  member: Member | null;
  onClose: () => void;
  onToggled: (updated: Member) => void;
}

export default function SuspendMemberDialog({
  member,
  onClose,
  onToggled,
}: Props) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const isSuspended = member?.status === 'suspended';

  const handleToggle = async () => {
    if (!member) return;
    setLoading(true);
    try {
      const newStatus = isSuspended ? 'active' : 'suspended';
      const { data, error } = await supabase
        .from('members')
        .update({ status: newStatus })
        .eq('id', member.id)
        .select()
        .single();
      if (error) throw error;
      toast.success(
        isSuspended
          ? `${member.full_name} reactivated`
          : `${member.full_name} suspended`,
      );
      onToggled(data as Member);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {member && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  isSuspended
                    ? 'bg-green-600/15 border border-green-600/20'
                    : 'bg-yellow-600/15 border border-yellow-600/20'
                }`}
              >
                {isSuspended ? (
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                ) : (
                  <ShieldOff className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              <h2 className="text-white font-bold text-lg text-center">
                {isSuspended ? 'Reactivate Member' : 'Suspend Member'}
              </h2>
              <p className="text-zinc-400 text-sm text-center mt-2">
                {isSuspended
                  ? `Reactivate ${member.full_name}'s membership?`
                  : `Suspend ${member.full_name}'s membership? They will be marked as inactive.`}
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggle}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all text-sm text-white ${
                    isSuspended
                      ? 'bg-green-600 hover:bg-green-500'
                      : 'bg-yellow-600 hover:bg-yellow-500'
                  } disabled:opacity-60`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSuspended ? (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Reactivate
                    </>
                  ) : (
                    <>
                      <ShieldOff className="w-4 h-4" /> Suspend
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
