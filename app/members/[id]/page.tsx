import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import MemberDetail from '@/components/members/MemberDetail';
import type { Member, Payment } from '@/types';

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (!member) notFound();

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('member_id', id)
    .order('paid_at', { ascending: false });

  return (
    <MemberDetail
      member={member as Member}
      payments={(payments as Payment[]) ?? []}
    />
  );
}
