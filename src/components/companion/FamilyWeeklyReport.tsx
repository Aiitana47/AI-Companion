'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Lightbulb,
  Moon,
  Pill,
  Users,
  ChevronRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { useCompanionStore } from '@/lib/companion-store'

const moodData = [
  { day: 'Mon', positive: 60, neutral: 25, negative: 15 },
  { day: 'Tue', positive: 55, neutral: 30, negative: 15 },
  { day: 'Wed', positive: 70, neutral: 20, negative: 10 },
  { day: 'Thu', positive: 65, neutral: 25, negative: 10 },
  { day: 'Fri', positive: 80, neutral: 15, negative: 5 },
  { day: 'Sat', positive: 75, neutral: 20, negative: 5 },
  { day: 'Sun', positive: 72, neutral: 18, negative: 10 },
]

const sleepData = [
  { day: 'Mon', hours: 6.8 },
  { day: 'Tue', hours: 7.2 },
  { day: 'Wed', hours: 7.5 },
  { day: 'Thu', hours: 6.5 },
  { day: 'Fri', hours: 7.8 },
  { day: 'Sat', hours: 8.0 },
  { day: 'Sun', hours: 7.3 },
]

export default function FamilyWeeklyReport() {
  const { weeklyReport, goBack } = useCompanionStore()

  return (
    <div className="screen-enter w-full max-w-[430px] mx-auto min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm px-5 pt-4 pb-3 border-b border-cream-dark"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-cream-dark hover:bg-cream-dark transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Weekly Report</h1>
            <p className="text-xs text-muted-foreground">Mar 15 – Mar 21</p>
          </div>
        </div>
      </motion.header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4 pb-8">
        {/* Mood Overview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">Mood Overview</h2>

          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl font-bold text-sage">
              {weeklyReport.moodTrend}%
            </span>
            <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ color: 'var(--sage)', backgroundColor: 'rgba(143, 174, 139, 0.1)' }}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Positive</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {weeklyReport.moodChange}
          </p>

          {/* Mood Bar Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} barCategoryGap="20%" stackOffset="expand">
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#7A7A7A' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E0D4',
                    borderRadius: '8px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar
                  dataKey="positive"
                  stackId="mood"
                  fill="#8FAE8B"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="neutral"
                  stackId="mood"
                  fill="#F4C9A8"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="negative"
                  stackId="mood"
                  fill="#C75B5B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-sage" />
              <span className="text-[10px] text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-warm-orange-light" />
              <span className="text-[10px] text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emergency" />
              <span className="text-[10px] text-muted-foreground">Negative</span>
            </div>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 border" style={{ backgroundColor: 'rgba(143, 174, 139, 0.08)', borderColor: 'rgba(143, 174, 139, 0.15)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(143, 174, 139, 0.15)' }}>
              <Lightbulb className="w-4 h-4 text-sage" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-0.5">Key Insight</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {weeklyReport.topInsight}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Health Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-foreground">Health Metrics</h2>

          {/* Sleep */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(143, 174, 139, 0.1)' }}>
                  <Moon className="w-4 h-4 text-sage-dark" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sleep</p>
                  <p className="text-xs text-muted-foreground">Average this week</p>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">
                {weeklyReport.sleepAverage}
              </span>
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D4" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#7A7A7A' }}
                  />
                  <YAxis
                    domain={[5, 9]}
                    hide
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E8E0D4',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    formatter={(value: number) => [`${value}h`, 'Sleep']}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#8FAE8B"
                    strokeWidth={2.5}
                    dot={{ fill: '#8FAE8B', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#6B8C68', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Medication Adherence */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(232, 145, 90, 0.1)' }}>
                  <Pill className="w-4 h-4 text-warm-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Medication Adherence</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
              </div>
              <span className="text-xl font-bold text-warm-orange">
                {weeklyReport.medicationAdherence}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-3 bg-cream-dark rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${weeklyReport.medicationAdherence}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-warm-orange to-warm-orange/80"
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">0%</span>
              <span className="text-[10px] text-muted-foreground">100%</span>
            </div>
          </div>

          {/* Social Interactions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(143, 174, 139, 0.1)' }}>
                  <Users className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Social Interactions</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-foreground">
                  {weeklyReport.socialInteractions}
                </span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">Recommendations</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-dark space-y-3">
            {weeklyReport.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-sage mt-1.5 shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to Dashboard Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={goBack}
            className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-cream-dark transition-colors active:scale-[0.98] hover:border-[rgba(143,174,139,0.4)]"
          >
            <ArrowLeft className="w-4 h-4 text-sage" />
            <span className="text-sm font-medium text-sage">Back to Dashboard</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
