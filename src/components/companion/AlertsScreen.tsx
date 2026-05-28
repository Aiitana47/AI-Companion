'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Info, AlertTriangle, AlertCircle, Check, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const alertTypeConfig = {
  info: {
    icon: Info,
    colorClass: 'text-[var(--sage)]',
    bgClass: 'bg-[var(--sage)]/10',
    borderClass: 'border-l-[var(--sage)]',
    dotClass: 'bg-[var(--sage)]',
  },
  warning: {
    icon: AlertTriangle,
    colorClass: 'text-[var(--warm-orange)]',
    bgClass: 'bg-[var(--warm-orange)]/10',
    borderClass: 'border-l-[var(--warm-orange)]',
    dotClass: 'bg-[var(--warm-orange)]',
  },
  emergency: {
    icon: AlertCircle,
    colorClass: 'text-[var(--emergency)]',
    bgClass: 'bg-[var(--emergency)]/10',
    borderClass: 'border-l-[var(--emergency)]',
    dotClass: 'bg-[var(--emergency)]',
  },
}

export default function AlertsScreen() {
  const { alerts, markAlertRead, goBack } = useCompanionStore()
  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="screen-enter flex flex-col px-6 py-6 min-h-[540px]">
      {/* Back button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 min-h-[44px] transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      {/* Title with count badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Alerts</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-[var(--emergency)] text-white text-xs font-bold px-2">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
          <Bell size={16} />
          <span className="text-sm">{alerts.length} total</span>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-96">
        {alerts.map((alert, index) => {
          const config = alertTypeConfig[alert.type]
          const Icon = config.icon

          return (
            <motion.button
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => markAlertRead(alert.id)}
              className={`w-full text-left rounded-xl border-l-4 ${config.borderClass} transition-all ${
                !alert.read
                  ? 'bg-white shadow-sm border-t border-r border-b border-[var(--border)]'
                  : 'bg-[var(--cream)]/50 border-t border-r border-b border-transparent opacity-60'
              }`}
              aria-label={`${alert.title}${!alert.read ? ' - unread' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon with colored background */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${config.bgClass} flex items-center justify-center mt-0.5`}>
                    <Icon size={18} className={config.colorClass} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-[var(--foreground)] truncate">
                        {alert.title}
                      </h3>
                      <span className="text-sm text-[var(--muted-foreground)] flex-shrink-0">{alert.time}</span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{alert.description}</p>
                  </div>
                </div>
                {!alert.read && (
                  <div className="mt-2 flex items-center justify-between pl-12">
                    <span className="text-xs text-[var(--sage)] font-medium">Tap to mark as read</span>
                    <div className={`w-2 h-2 rounded-full ${config.dotClass} animate-pulse`} />
                  </div>
                )}
                {alert.read && (
                  <div className="mt-2 flex items-center gap-1 pl-12">
                    <Check size={12} className="text-[var(--sage)]" />
                    <span className="text-xs text-[var(--muted-foreground)]">Read</span>
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {alerts.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--cream-dark)] flex items-center justify-center mb-3">
            <Bell size={28} className="text-[var(--muted-foreground)]" />
          </div>
          <p className="text-xl text-[var(--muted-foreground)]">No alerts</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">All clear!</p>
        </div>
      )}
    </div>
  )
}
