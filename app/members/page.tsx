import { createClient } from '@/lib/supabase/server';
import type { Member } from '@/types';
import PublicMembersView from '@/components/members/PublicMembersView';

export default async function PublicMembersPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  return <PublicMembersView initialMembers={(members as Member[]) ?? []} />;
}
