'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Member, MemberWithFeeStatus } from '@/types';
import { getFeeStatus } from '@/utils/date';
import { useSupabase } from './useSupabase';

export function useMembers() {
  const supabase = useSupabase();
  const [members, setMembers] = useState<MemberWithFeeStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      const withStatus: MemberWithFeeStatus[] = (data as Member[]).map((m) => ({
        ...m,
        fee_status: getFeeStatus(m.expiry_date),
      }));
      setMembers(withStatus);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers };
}
