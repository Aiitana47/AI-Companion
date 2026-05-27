'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Phone, Volume2, Sun } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ProfileScreen() {
  const { userName, startCall, goBack } = useCompanionStore()
  const [volume, setVolume] = useState(75)
  const [brightness, setBrightness] = useState(80)

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

      {/* Avatar and name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--sage)] flex items-center justify-center text-white text-3xl font-bold mb-3">
          M
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Martha Higgins</h2>
      </motion.div>

      {/* Info rows */}
      <div className="space-y-3 mb-6">
        {[
          { label: 'Age', value: '82' },
          { label: 'Room', value: 'Living Room' },
          { label: 'Device', value: 'Smart Display' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 px-4 rounded-xl bg-white border border-[var(--border)]"
          >
            <span className="text-base text-[var(--muted-foreground)]">{item.label}</span>
            <span className="text-base font-medium text-[var(--foreground)]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Emergency contacts */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <h3 className="text-base font-semibold text-[var(--foreground)] mb-3">Emergency Contacts</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-[var(--foreground)]">James</p>
            <p className="text-sm text-[var(--muted-foreground)]">Son</p>
          </div>
          <motion.button
            onClick={() => startCall('audio', 'James')}
            className="w-12 h-12 rounded-full bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white flex items-center justify-center transition-colors"
            whileTap={{ scale: 0.9 }}
            aria-label="Call James"
          >
            <Phone size={22} />
          </motion.button>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        {/* Volume slider */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Volume2 size={18} className="text-[var(--muted-foreground)]" />
            <span className="text-base text-[var(--foreground)]">Voice Volume</span>
            <span className="text-sm text-[var(--muted-foreground)] ml-auto">{volume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--sage) ${volume}%, var(--cream-dark) ${volume}%)`,
            }}
            aria-label="Voice volume"
          />
        </div>

        {/* Brightness slider */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sun size={18} className="text-[var(--muted-foreground)]" />
            <span className="text-base text-[var(--foreground)]">Brightness</span>
            <span className="text-sm text-[var(--muted-foreground)] ml-auto">{brightness}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--warm-orange) ${brightness}%, var(--cream-dark) ${brightness}%)`,
            }}
            aria-label="Brightness"
          />
        </div>
      </div>
    </div>
  )
}
