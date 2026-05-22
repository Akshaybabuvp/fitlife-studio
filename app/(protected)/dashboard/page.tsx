import { createClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/dashboard/DashboardClient';
import type { Member } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .order('paid_at', { ascending: false });

  return (
    <DashboardClient
      initialMembers={(members as Member[]) ?? []}
      initialPayments={payments ?? []}
    />
  );
}
