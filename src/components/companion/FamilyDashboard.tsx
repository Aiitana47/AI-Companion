'use client'

import { motion } from 'framer-motion'
import {
  Home,
  Phone,
  Video,
  MessageCircle,
  Bell,
  BarChart3,
  Settings,
  Heart,
  Moon,
  Activity,
  ChevronRight,
  AlertTriangle,
  Info,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react'
import { useCompanionStore, type Alert } from '@/lib/companion-store'

const moodEmojiMap: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😔',
  angry: '😠',
}

const moodLabelMap: Record<string, string> = {
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  angry: 'Upset',
}

const alertTypeConfig: Record<Alert['type'], { color: string; icon: React.ReactNode }> = {
  info: {
    color: 'text-sage',
    icon: <Info className="w-4 h-4" />,
  },
  warning: {
    color: 'text-warm-orange',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  emergency: {
    color: 'text-emergency',
    icon: <ShieldAlert className="w-4 h-4" />,
  },
}

export default function FamilyDashboard() {
  const { mood, alerts, weeklyReport, setScreen, startCall } = useCompanionStore()

  const currentMood = mood || 'happy'
  const unreadAlerts = alerts.filter((a) => !a.read).slice(0, 3)

  const handleAudioDropIn = () => {
    startCall('audio', 'Martha')
  }

  const handleVideoCall = () => {
    startCall('video', 'Martha')
  }

  const handleMessage = () => {
    // For now, just a placeholder action
  }

  const bottomTabs = [
    { icon: Home, label: 'Home', active: true, onClick: () => {} },
    { icon: Bell, label: 'Alerts', active: false, onClick: () => setScreen('alerts') },
    { icon: BarChart3, label: 'Report', active: false, onClick: () => setScreen('family-weekly-report') },
    { icon: Settings, label: 'Settings', active: false, onClick: () => {} },
  ]

  return (
    <div className="screen-enter w-full max-w-[430px] mx-auto min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm px-5 pt-4 pb-3 border-b border-cream-dark"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Martha&apos;s Companion
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Family view</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage" />
            </span>
            <span className="text-xs font-medium text-sage-dark">All good</span>
          </div>
        </div>
      </motion.header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4 pb-24">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sage/15 flex items-center justify-center">
                  <Home className="w-4 h-4 text-sage" />
                </div>
                <span className="text-sm font-semibold text-foreground">At home</span>
              </div>
              <p className="text-xs text-muted-foreground pl-10">
                Listening to music · 5 min ago
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">{moodEmojiMap[currentMood]}</span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {moodLabelMap[currentMood]}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleAudioDropIn}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-cream-dark hover:border-sage/40 hover:shadow-md transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
                <Phone className="w-5 h-5 text-sage" />
              </div>
              <span className="text-[11px] font-medium text-foreground">Audio Drop-in</span>
            </button>

            <button
              onClick={handleVideoCall}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-cream-dark hover:border-warm-orange/40 hover:shadow-md transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-warm-orange/15 flex items-center justify-center">
                <Video className="w-5 h-5 text-warm-orange" />
              </div>
              <span className="text-[11px] font-medium text-foreground">Video Call</span>
            </button>

            <button
              onClick={handleMessage}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-cream-dark hover:border-sage/40 hover:shadow-md transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-sage" />
              </div>
              <span className="text-[11px] font-medium text-foreground">Message</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Recent Alerts</h2>
            <button
              onClick={() => setScreen('alerts')}
              className="text-xs text-sage font-medium hover:text-sage-dark transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {unreadAlerts.length === 0 && (
              <div className="bg-white rounded-xl p-4 text-center text-sm text-muted-foreground border border-cream-dark">
                No unread alerts
              </div>
            )}
            {unreadAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white rounded-xl p-3.5 shadow-sm border border-cream-dark flex items-start gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.type === 'emergency'
                      ? 'bg-emergency/10'
                      : alert.type === 'warning'
                      ? 'bg-warm-orange/10'
                      : 'bg-sage/10'
                  }`}
                >
                  <span className={alertTypeConfig[alert.type].color}>
                    {alertTypeConfig[alert.type].icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {alert.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {alert.description}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                  {alert.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Weekly Summary</h2>
            <span className="text-[10px] text-muted-foreground">Mar 15 – Mar 21</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Mood Trend */}
            <div className="bg-cream rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-sage" />
                <span className="text-[10px] text-muted-foreground font-medium">Mood</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-sage">
                  {weeklyReport.moodTrend}%
                </span>
                <span className="text-[10px] text-sage">positive</span>
              </div>
              {/* Mini sparkline bars */}
              <div className="flex items-end gap-0.5 mt-2 h-6">
                {[60, 55, 70, 65, 80, 75, 72].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-sage/30"
                    style={{ height: `${(val / 100) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Medication Adherence */}
            <div className="bg-cream rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-warm-orange" />
                <span className="text-[10px] text-muted-foreground font-medium">Medication</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-warm-orange">
                  {weeklyReport.medicationAdherence}%
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-warm-orange rounded-full transition-all"
                  style={{ width: `${weeklyReport.medicationAdherence}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setScreen('family-weekly-report')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-sage hover:text-sage-dark transition-colors"
          >
            View full report
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Vitals Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-cream-dark"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Vitals</h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Heart Rate */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emergency/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-emergency" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground leading-none">72</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">bpm</p>
              </div>
            </div>

            {/* Sleep */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-sage-dark" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground leading-none">7h 20m</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">last sleep</p>
              </div>
            </div>

            {/* Activity Level */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-warm-orange/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-warm-orange" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground leading-none">Moderate</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">activity</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Tab Navigation */}
      <nav className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-sm border-t border-cream-dark">
        <div className="flex items-center justify-around py-2 px-4 max-w-[430px] mx-auto">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.label}
                onClick={tab.onClick}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors ${
                  tab.active
                    ? 'text-sage'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {tab.active && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-1 h-1 rounded-full bg-sage mt-0.5"
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
