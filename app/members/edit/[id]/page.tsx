import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import EditMemberForm from '@/components/members/EditMemberForm';
import type { Member } from '@/types';

export default async function EditMemberPage({
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

  return <EditMemberForm member={member as Member} />;
}
