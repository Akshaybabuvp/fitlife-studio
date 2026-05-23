'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { sendWhatsAppMessage, getWelcomeMessage } from '@/services/whatsapp';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import ImageUpload from '@/components/members/ImageUpload';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),

  phone: z.string().min(10, 'Enter a valid phone number').max(15),

  address: z.string().optional(),

  gender: z.enum(['male', 'female', 'other']).optional(),

  join_date: z.string().min(1, 'Join date is required'),

  fee_amount: z.coerce
    .number({
      invalid_type_error: 'Fee amount must be a number',
    })
    .min(1, 'Fee amount is required'),

  payment_method: z.enum(['cash', 'gpay']).optional(),

  expiry_date: z.string().min(1, 'Expiry date is required'),

  next_payment_date: z.string().optional(),

  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddMemberPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      full_name: '',
      phone: '',
      address: '',
      gender: undefined,
      join_date: today,
      fee_amount: 0,
      payment_method: undefined,
      expiry_date: nextMonth,
      next_payment_date: '',
      notes: '',
    },
  });

  const uploadImage = async (memberId: string): Promise<string | null> => {
    if (!imageFile) return null;

    const ext = imageFile.name.split('.').pop();

    const path = `${memberId}.${ext}`;

    const { error } = await supabase.storage
      .from('member-images')
      .upload(path, imageFile, {
        upsert: true,
      });

    if (error) return null;

    const { data } = supabase.storage.from('member-images').getPublicUrl(path);

    return data.publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const { data: member, error } = await supabase
        .from('members')
        .insert({
          full_name: data.full_name,
          phone: data.phone,
          address: data.address || null,
          gender: data.gender || null,
          join_date: data.join_date,
          fee_amount: data.fee_amount,
          payment_method: data.payment_method || null,
          expiry_date: data.expiry_date,
          next_payment_date: data.next_payment_date || null,
          notes: data.notes || null,
          status: 'active',
          profile_image: null,
        })
        .select()
        .single();

      if (error) throw error;

      if (imageFile && member) {
        const imageUrl = await uploadImage(member.id);

        if (imageUrl) {
          await supabase
            .from('members')
            .update({
              profile_image: imageUrl,
            })
            .eq('id', member.id);
        }
      }

      if (member) {
        await supabase.from('payments').insert({
          member_id: member.id,
          amount: data.fee_amount,
          payment_method: data.payment_method || null,
          paid_at: new Date().toISOString(),
        });

        await sendWhatsAppMessage(
          data.phone,
          getWelcomeMessage(data.full_name),
        );
      }

      toast.success(`${data.full_name} added successfully!`);

      router.push('/members');
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to add member';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = (delay: number) => ({
    initial: {
      opacity: 0,
      y: 16,
    },

    animate: {
      opacity: 1,
      y: 0,
    },

    transition: {
      delay,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <motion.div {...fadeUp(0)} className="flex items-center gap-4">
          <Link
            href="/members"
            className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-white">Add New Member</h1>

            <p className="text-zinc-500 text-sm">Fill in the details below</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div {...fadeUp(0.05)}>
            <ImageUpload
              preview={imagePreview}
              onFileSelect={(file, preview) => {
                setImageFile(file);
                setImagePreview(preview);
              }}
              onRemove={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
            />
          </motion.div>

          <motion.div
            {...fadeUp(0.1)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Personal Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                error={errors.full_name?.message}
                required
              >
                <InputWrapper icon={User}>
                  <input
                    {...register('full_name')}
                    placeholder="e.g. Rahul Kumar"
                    className={inputClass(!!errors.full_name)}
                  />
                </InputWrapper>
              </Field>

              <Field
                label="Phone Number"
                error={errors.phone?.message}
                required
              >
                <InputWrapper icon={Phone}>
                  <input
                    {...register('phone')}
                    placeholder="e.g. 9876543210"
                    className={inputClass(!!errors.phone)}
                  />
                </InputWrapper>
              </Field>
            </div>

            <Field label="Address" error={errors.address?.message}>
              <InputWrapper icon={MapPin}>
                <input
                  {...register('address')}
                  placeholder="Street, City"
                  className={inputClass(false)}
                />
              </InputWrapper>
            </Field>

            <Field label="Gender" error={errors.gender?.message}>
              <select
                {...register('gender')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="">Select gender</option>

                <option value="male">Male</option>

                <option value="female">Female</option>

                <option value="other">Other</option>
              </select>
            </Field>
          </motion.div>

          <motion.div
            {...fadeUp(0.15)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Fee & Membership
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Join Date"
                error={errors.join_date?.message}
                required
              >
                <InputWrapper icon={Calendar}>
                  <input
                    type="date"
                    {...register('join_date')}
                    className={
                      inputClass(!!errors.join_date) + ' [color-scheme:dark]'
                    }
                  />
                </InputWrapper>
              </Field>

              <Field
                label="Expiry Date"
                error={errors.expiry_date?.message}
                required
              >
                <InputWrapper icon={Calendar}>
                  <input
                    type="date"
                    {...register('expiry_date')}
                    className={
                      inputClass(!!errors.expiry_date) + ' [color-scheme:dark]'
                    }
                  />
                </InputWrapper>
              </Field>

              <Field
                label="Fee Amount (₹)"
                error={errors.fee_amount?.message}
                required
              >
                <InputWrapper icon={DollarSign}>
                  <input
                    type="number"
                    {...register('fee_amount', {
                      valueAsNumber: true,
                    })}
                    placeholder="e.g. 800"
                    className={inputClass(!!errors.fee_amount)}
                  />
                </InputWrapper>
              </Field>

              <Field
                label="Payment Method"
                error={errors.payment_method?.message}
              >
                <InputWrapper icon={CreditCard}>
                  <select
                    {...register('payment_method')}
                    className="w-full bg-transparent text-white text-sm focus:outline-none pl-1"
                  >
                    <option value="" className="bg-zinc-800">
                      Select method
                    </option>

                    <option value="cash" className="bg-zinc-800">
                      Cash
                    </option>

                    <option value="gpay" className="bg-zinc-800">
                      GPay
                    </option>
                  </select>
                </InputWrapper>
              </Field>
            </div>

            <Field
              label="Next Payment Date"
              error={errors.next_payment_date?.message}
            >
              <InputWrapper icon={Calendar}>
                <input
                  type="date"
                  {...register('next_payment_date')}
                  className={inputClass(false) + ' [color-scheme:dark]'}
                />
              </InputWrapper>
            </Field>
          </motion.div>

          <motion.div
            {...fadeUp(0.2)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Additional Notes
            </h2>

            <Field label="Notes" error={errors.notes?.message}>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />

                <textarea
                  {...register('notes')}
                  placeholder="Any special notes about this member..."
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm resize-none"
                />
              </div>
            </Field>
          </motion.div>

          <motion.div {...fadeUp(0.25)} className="flex gap-3 pb-6">
            <Link
              href="/members"
              className="flex-1 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold py-3.5 rounded-2xl transition-all text-sm"
            >
              Cancel
            </Link>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-red-600/20 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Add Member
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-300">
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function InputWrapper({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center bg-zinc-800 border border-zinc-700 rounded-xl focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all">
      <Icon className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />

      <div className="w-full pl-10 pr-4 py-3">{children}</div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full bg-transparent text-white placeholder:text-zinc-500 text-sm focus:outline-none',
    hasError && 'placeholder:text-red-400',
  );
}
