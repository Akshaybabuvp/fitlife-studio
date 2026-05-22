'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/members/add', label: 'Add Member', icon: UserPlus },
];

export default function TopBar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/login');
    router.refresh();
  };

  // Page title from pathname
  const pageTitle =
    navItems.find(
      (n) => pathname === n.href || pathname.startsWith(n.href + '/'),
    )?.label ?? 'FitLife Studio';

  return (
    <>
      <header className="bg-zinc-900/80 backdrop-blur border-b border-zinc-800 px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        {/* Left: mobile logo + page title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Desktop page title */}
          <h1 className="hidden md:block text-white font-semibold text-lg">
            {pageTitle}
          </h1>
        </div>

        {/* Right: user menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-3 py-2 transition-all"
          >
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="hidden sm:block text-zinc-300 text-sm font-medium">
              Admin
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-zinc-800">
                  <p className="text-white text-sm font-medium">Admin</p>
                  <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:bg-red-600/10 rounded-lg text-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {userMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
          )}
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 z-50 md:hidden flex flex-col"
            >
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      FitLife Studio
                    </p>
                    <p className="text-zinc-500 text-xs">Panambad</p>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/dashboard' &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                          active
                            ? 'bg-red-600/15 text-red-400 border border-red-600/20'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-zinc-800">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-600/10 rounded-xl text-sm transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
