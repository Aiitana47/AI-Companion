'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Phone, Volume2, Sun, Palette, Shield, Heart } from 'lucide-react'
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
        className="flex items-center gap-2 text-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 min-h-[44px] transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      {/* Avatar and name with decorative background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col items-center mb-6 relative"
      >
        {/* Decorative circle behind avatar */}
        <div className="absolute w-28 h-28 rounded-full bg-[var(--sage)]/10 -z-0" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--sage)] to-[var(--sage-dark)] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
          M
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mt-3">Martha Higgins</h2>
        <div className="flex items-center gap-1.5 mt-1">
          <Heart size={14} className="text-[var(--emergency)]" fill="currentColor" />
          <span className="text-sm text-[var(--muted-foreground)]">Feeling happy today</span>
        </div>
      </motion.div>

      {/* Info rows with card style */}
      <div className="space-y-2 mb-5">
        {[
          { label: 'Age', value: '82', icon: '🎂' },
          { label: 'Room', value: 'Living Room', icon: '🏠' },
          { label: 'Device', value: 'Smart Display', icon: '📱' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white border border-[var(--border)] shadow-sm"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-base text-[var(--muted-foreground)]">{item.label}</span>
            <span className="text-base font-medium text-[var(--foreground)] ml-auto">{item.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Emergency contacts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-[var(--border)] p-4 mb-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-[var(--sage)]" />
          <h3 className="text-base font-semibold text-[var(--foreground)]">Emergency Contacts</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--warm-orange)]/15 flex items-center justify-center text-[var(--warm-orange)] font-bold">
              J
            </div>
            <div>
              <p className="text-lg font-medium text-[var(--foreground)]">James</p>
              <p className="text-sm text-[var(--muted-foreground)]">Son</p>
            </div>
          </div>
          <motion.button
            onClick={() => startCall('audio', 'James')}
            className="w-12 h-12 rounded-full bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white flex items-center justify-center transition-colors shadow-md"
            whileTap={{ scale: 0.9 }}
            aria-label="Call James"
          >
            <Phone size={22} />
          </motion.button>
        </div>
      </motion.div>

      {/* Settings */}
      <div className="space-y-4">
        {/* Volume slider */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Volume2 size={18} className="text-[var(--muted-foreground)]" />
            <span className="text-base text-[var(--foreground)]">Voice Volume</span>
            <span className="text-sm text-[var(--sage)] font-medium ml-auto">{volume}%</span>
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
            <span className="text-sm text-[var(--warm-orange)] font-medium ml-auto">{brightness}%</span>
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
