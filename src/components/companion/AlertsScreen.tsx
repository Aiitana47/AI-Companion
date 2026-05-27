'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Info, AlertTriangle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AlertsScreen() {
  const { alerts, markAlertRead, goBack } = useCompanionStore()

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={22} className="text-[var(--sage)]" />
      case 'warning':
        return <AlertTriangle size={22} className="text-[var(--warm-orange)]" />
      case 'emergency':
        return <AlertCircle size={22} className="text-[var(--emergency)]" />
      default:
        return <Info size={22} className="text-[var(--sage)]" />
    }
  }

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

      {/* Title */}
      <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
        Alerts
      </h2>

      {/* Alerts list */}
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-96">
        {alerts.map((alert, index) => (
          <motion.button
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => markAlertRead(alert.id)}
            className={`w-full text-left p-4 rounded-xl bg-white border transition-all ${
              !alert.read
                ? 'border-l-4 border-l-[var(--sage)] border-t-[var(--border)] border-r-[var(--border)] border-b-[var(--border)]'
                : 'border-[var(--border)] opacity-70'
            }`}
            aria-label={`${alert.title}${!alert.read ? ' - unread' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] truncate">
                    {alert.title}
                  </h3>
                  <span className="text-sm text-[var(--muted-foreground)] flex-shrink-0">{alert.time}</span>
                </div>
                <p className="text-base text-[var(--muted-foreground)] mt-1">{alert.description}</p>
              </div>
            </div>
            {!alert.read && (
              <div className="mt-2 flex justify-end">
                <span className="text-xs text-[var(--sage)] font-medium">Tap to mark as read</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-[var(--muted-foreground)]">No alerts</p>
        </div>
      )}
    </div>
  )
}
