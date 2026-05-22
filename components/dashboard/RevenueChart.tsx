'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MonthlyRevenue } from '@/types';

interface Props {
  data: MonthlyRevenue[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-zinc-400 font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.fill }}
          />
          <span className="text-zinc-400 capitalize">{p.dataKey}:</span>
          <span className="text-white font-semibold">
            {p.dataKey === 'revenue'
              ? `₹${p.value.toLocaleString('en-IN')}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart({ data }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-base">Revenue Overview</h2>
        <p className="text-zinc-500 text-sm mt-0.5">
          Last 6 months performance
        </p>
      </div>

      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: '#71717a', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '16px',
                fontSize: '12px',
                color: '#71717a',
              }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#dc2626"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="members"
              name="New Members"
              fill="#3f3f46"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
