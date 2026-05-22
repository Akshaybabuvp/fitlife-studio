export type Gender = 'male' | 'female' | 'other';
export type PaymentMethod = 'cash' | 'gpay';
export type MemberStatus = 'active' | 'suspended';
export type FeeStatus = 'active' | 'expiring_soon' | 'expired';

export interface Member {
  id: string;
  full_name: string;
  phone: string;
  address: string | null;
  profile_image: string | null;
  gender: Gender | null;
  join_date: string;
  fee_amount: number;
  payment_method: PaymentMethod | null;
  expiry_date: string;
  next_payment_date: string | null;
  status: MemberStatus;
  notes: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_method: PaymentMethod | null;
  paid_at: string;
}

export interface Notification {
  id: string;
  member_id: string;
  type: string;
  message: string | null;
  sent_at: string;
}

export interface MemberWithFeeStatus extends Member {
  fee_status: FeeStatus;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  suspendedMembers: number;
  monthlyProfit: number;
  yearlyProfit: number;
  expiringThisWeek: number;
  expiredMembers: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  members: number;
}
