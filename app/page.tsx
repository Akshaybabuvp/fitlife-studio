'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Dumbbell,
  MapPin,
  User,
  ArrowRight,
  LayoutDashboard,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Phone,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Smart Member Management',
    desc: 'Add, edit, suspend and manage all gym members from one clean dashboard.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Analytics',
    desc: 'Track monthly and yearly profit with beautiful real-time charts.',
  },
  {
    icon: Clock,
    title: 'Fee Expiry Alerts',
    desc: 'Never miss a renewal. Expired fees are highlighted automatically.',
  },
  {
    icon: Shield,
    title: 'Secure Admin Access',
    desc: 'Only the gym owner can log in. Members have zero access.',
  },
  {
    icon: Phone,
    title: 'One-Tap Calling',
    desc: 'Call any member directly from the members list with one tap.',
  },
  {
    icon: Star,
    title: 'WhatsApp Reminders',
    desc: 'Automated fee reminder messages sent to members on expiry.',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  }),
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              FitLife Studio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-zinc-800"
            >
              Home
            </Link>
            <Link
              href="/members"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-zinc-800"
            >
              Members
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-zinc-800"
            >
              Dashboard
            </Link>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Login</span>
            <span className="sm:hidden">Login</span>
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-800/6 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-medium px-4 py-2 rounded-full mb-8"
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            Premium Gym Management System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          >
            Manage Your Gym
            <span className="block text-red-500 mt-1">Like a Pro</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            FitLife Studio&apos;s complete management system — track members,
            fees, revenue and send automatic reminders, all from one dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-red-600/25 text-base"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/members"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base"
            >
              <User className="w-5 h-5" />
              View Members
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {[
              { icon: Dumbbell, text: 'FitLife Studio' },
              { icon: MapPin, text: 'Panambad, Maranchery' },
              { icon: User, text: 'Trainer Akshay' },
            ].map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm px-4 py-2 rounded-full"
              >
                <pill.icon className="w-3.5 h-3.5 text-red-500" />
                {pill.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '100+', label: 'Members Managed' },
              { value: '₹0', label: 'Software Cost' },
              { value: '24/7', label: 'Access Anytime' },
              { value: '100%', label: 'Mobile Ready' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-black text-white">
                  {stat.value}
                </p>
                <p className="text-zinc-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Everything You Need
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto">
              Built specifically for FitLife Studio — clean, fast, and designed
              for daily use.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-colors group"
              >
                <div className="w-11 h-11 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600/15 transition-colors">
                  <f.icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 sm:p-14 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/15 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-600/30">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Log in to your FitLife Studio dashboard and start managing
                members right now.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-red-600/25 text-base"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">FitLife Studio</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            Panambad, Maranchery · Trainer Akshay
          </div>
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} FitLife Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
