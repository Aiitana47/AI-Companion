'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Check, Mic, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MedicationReminderScreen() {
  const { medications, markMedicationTaken, goBack } = useCompanionStore()

  // Find the next untaken medication to highlight
  const nextMedication = medications.find(m => !m.taken)
  const takenCount = medications.filter(m => m.taken).length

  const handleMarkDone = (id: string) => {
    markMedicationTaken(id)
  }

  return (
    <div className="screen-enter flex flex-col px-6 py-6 min-h-[540px]">
      {/* Back button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 min-h-[44px] transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      {/* Current medication highlight */}
      {nextMedication && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] mb-6"
        >
          <p className="text-5xl font-bold text-[var(--sage)] text-center mb-2">
            {nextMedication.time}
          </p>
          <p className="text-xl text-[var(--foreground)] text-center mb-1">
            Take {nextMedication.name}
          </p>
          <p className="text-base text-[var(--muted-foreground)] text-center mb-6">
            {nextMedication.dosage}
          </p>

          {/* Done button with voice indicator */}
          <motion.button
            onClick={() => handleMarkDone(nextMedication.id)}
            className="w-full py-4 rounded-2xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors"
            whileTap={{ scale: 0.95 }}
            aria-label="Mark medication as taken"
          >
            <Check size={24} />
            Done
            <Mic size={18} className="opacity-70" />
          </motion.button>
          <p className="text-sm text-[var(--muted-foreground)] text-center mt-2">
            Say &quot;Done&quot; to confirm
          </p>

          {/* Location hint */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[var(--warm-orange)]">
            <MapPin size={18} />
            <span className="text-base">Kitchen, top cupboard</span>
          </div>
        </motion.div>
      )}

      {/* All medications list */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
          Today&apos;s Medications ({takenCount}/{medications.length})
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                med.taken
                  ? 'bg-[var(--sage-light)]/20'
                  : med.id === nextMedication?.id
                  ? 'bg-white border border-[var(--sage)]'
                  : 'bg-white border border-[var(--border)]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  med.taken
                    ? 'bg-[var(--sage)] text-white'
                    : 'bg-[var(--cream-dark)] text-[var(--muted-foreground)]'
                }`}
              >
                {med.taken ? <Check size={16} /> : <span className="text-xs font-bold">{med.time}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-medium ${med.taken ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>
                  {med.name}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">{med.dosage}</p>
              </div>
              <span className="text-sm text-[var(--muted-foreground)]">{med.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
