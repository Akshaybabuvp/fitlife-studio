'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Member } from '@/types';

interface Props {
  member: Member | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export default function DeleteMemberDialog({
  member,
  onClose,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!member) return;
    setLoading(true);
    try {
      // Delete image from storage if exists
      if (member.profile_image) {
        const path = member.profile_image.split('/member-images/')[1];
        if (path) await supabase.storage.from('member-images').remove([path]);
      }
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', member.id);
      if (error) throw error;
      toast.success(`${member.full_name} deleted`);
      onDeleted(member.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
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
              <div className="w-12 h-12 bg-red-600/15 border border-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-white font-bold text-lg text-center">
                Delete Member
              </h2>
              <p className="text-zinc-400 text-sm text-center mt-2">
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">
                  {member.full_name}
                </span>
                ? This action cannot be undone.
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
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Delete
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
