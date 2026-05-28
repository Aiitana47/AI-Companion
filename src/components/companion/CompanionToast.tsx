'use client'

import { useEffect } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { Bell, Pill, MessageCircle, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CompanionToast() {
  const { toast, dismissToast } = useCompanionStore()

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(dismissToast, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast, dismissToast])

  const getIcon = () => {
    if (!toast) return null
    switch (toast.type) {
      case 'medication':
        return <Pill size={18} className="text-[var(--sage)]" />
      case 'message':
        return <MessageCircle size={18} className="text-[var(--sage)]" />
      case 'warning':
        return <AlertTriangle size={18} className="text-[var(--warm-orange)]" />
      default:
        return <Bell size={18} className="text-[var(--sage)]" />
    }
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-shrink-0 overflow-hidden"
        >
          <div className="mx-3 mt-2 rounded-xl border-l-4 border-[var(--sage)] bg-white shadow-md px-4 py-3 flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--sage)]/10 flex items-center justify-center">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[var(--muted-foreground)] truncate">{toast.description}</p>
              )}
            </div>
            <button
              onClick={dismissToast}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--cream-dark)] transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
