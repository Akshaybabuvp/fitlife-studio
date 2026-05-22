'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dumbbell, LayoutDashboard, Users, UserPlus, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/members/add', label: 'Add Member', icon: UserPlus },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                FitLife Studio
              </p>
              <p className="text-zinc-500 text-xs">Panambad</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-red-600/15 text-red-400 border border-red-600/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-zinc-800">
          <p className="text-zinc-600 text-xs text-center">Trainer Akshay</p>
        </div>
      </aside>
    </>
  );
}
