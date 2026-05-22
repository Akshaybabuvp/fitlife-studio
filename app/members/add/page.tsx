import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AddMemberPage from '@/components/members/AddMemberPage';

export default async function AddMember() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <AddMemberPage />;
}
