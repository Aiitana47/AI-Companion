'use client'

import { useCompanionStore } from '@/lib/companion-store'
import { Heart, Footprints, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function SmartWatchFrame() {
  const { alerts, activateEmergency } = useCompanionStore()

  const [now, setNow] = useState<Date | null>(null)
  const [heartRate, setHeartRate] = useState(72)
  const [steps, setSteps] = useState(3240)
  const [screen, setScreen] = useState<'main' | 'vitals' | 'sos'>('main')

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    queueMicrotask(() => setNow(new Date()))
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => Math.max(62, Math.min(88, prev + (Math.floor(Math.random() * 5) - 2))))
      setSteps(prev => prev + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const hours = now ? now.getHours() : 0
  const minutes = now ? now.getMinutes() : 0
  const seconds = now ? now.getSeconds() : 0
  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6
  const secondAngle = seconds * 6
  const timeStr = now
    ? now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '--:--'
  const dateStr = now
    ? now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : ''

  const unreadAlerts = alerts.filter(a => !a.read).length

  return (
    <div className="flex flex-col items-center gap-0">
      {/* Top strap */}
      <div
        className="w-[72px] h-10 rounded-b-xl"
        style={{ background: 'linear-gradient(180deg, #C4A882 0%, #B8976C 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
      />

      {/* Watch body */}
      <div className="relative flex items-center justify-center">
        {/* Soft glow */}
        <div
          className="absolute -inset-8 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8FAE8B55 0%, transparent 70%)' }}
        />

        {/* Outer case — warm beige/taupe */}
        <div
          className="relative w-60 h-60 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #E8DDD0 0%, #D4C4B0 50%, #C8B89A 100%)',
            boxShadow: '0 4px 0 #B8A080, 0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {/* Crown button */}
          <div
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-3 h-9 rounded-full"
            style={{ background: 'linear-gradient(90deg, #D4C4B0 0%, #C0AC90 100%)', boxShadow: '2px 0 6px rgba(0,0,0,0.2)' }}
          />

          {/* Screen — cream white face */}
          <div
            className="w-48 h-48 rounded-full overflow-hidden flex flex-col"
            style={{ background: '#FAF6F0', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <AnimatePresence mode="wait">

              {/* ── MAIN CLOCK SCREEN ── */}
              {screen === 'main' && (
                <motion.div
                  key="main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-1"
                  style={{ background: '#FAF6F0' }}
                >
                  {/* Analog clock */}
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    {/* Outer ring */}
                    <circle cx="55" cy="55" r="52" fill="none" stroke="#E8DDD0" strokeWidth="1.5" />
                    {/* Hour markers */}
                    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
                      <line
                        key={angle}
                        x1="55" y1="6"
                        x2="55" y2={i % 3 === 0 ? "13" : "9"}
                        stroke={i % 3 === 0 ? '#8FAE8B' : '#C4B8A8'}
                        strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
                        strokeLinecap="round"
                        transform={`rotate(${angle} 55 55)`}
                      />
                    ))}
                    {/* Second hand */}
                    <line
                      x1="55" y1="55" x2="55" y2="14"
                      stroke="#E8915A" strokeWidth="1" strokeLinecap="round"
                      transform={`rotate(${secondAngle} 55 55)`}
                    />
                    {/* Hour hand */}
                    <line
                      x1="55" y1="55" x2="55" y2="28"
                      stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"
                      transform={`rotate(${hourAngle} 55 55)`}
                    />
                    {/* Minute hand */}
                    <line
                      x1="55" y1="55" x2="55" y2="18"
                      stroke="#6B8C68" strokeWidth="3" strokeLinecap="round"
                      transform={`rotate(${minuteAngle} 55 55)`}
                    />
                    {/* Center dot */}
                    <circle cx="55" cy="55" r="4" fill="#8FAE8B" />
                    <circle cx="55" cy="55" r="2" fill="#FAF6F0" />
                  </svg>

                  {/* Digital time */}
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: '#2D2D2D', letterSpacing: '0.04em', lineHeight: 1 }}
                  >
                    {timeStr}
                  </span>

                  {/* Heart rate subtle indicator */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <Heart size={10} fill="#C75B5B" className="text-[#C75B5B]" />
                    <span className="text-[11px] tabular-nums" style={{ color: '#7A7A7A' }}>{heartRate} bpm</span>
                  </div>
                </motion.div>
              )}

              {/* ── VITALS SCREEN ── */}
              {screen === 'vitals' && (
                <motion.div
                  key="vitals"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-3 px-5"
                  style={{ background: '#FAF6F0' }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#8FAE8B' }}>
                    Vitals
                  </span>

                  {/* Heart rate */}
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Heart size={13} fill="#C75B5B" className="text-[#C75B5B]" />
                        <span className="text-[11px]" style={{ color: '#7A7A7A' }}>Heart rate</span>
                      </div>
                      <span className="text-[13px] font-bold tabular-nums" style={{ color: '#2D2D2D' }}>
                        {heartRate} <span className="text-[10px] font-normal" style={{ color: '#7A7A7A' }}>bpm</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: '#F0E8DC' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${((heartRate - 50) / 60) * 100}%`, background: '#E8915A' }}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Footprints size={13} className="text-[#8FAE8B]" />
                        <span className="text-[11px]" style={{ color: '#7A7A7A' }}>Steps today</span>
                      </div>
                      <span className="text-[13px] font-bold tabular-nums" style={{ color: '#2D2D2D' }}>
                        {steps.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: '#F0E8DC' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min((steps / 8000) * 100, 100)}%`, background: '#8FAE8B' }}
                      />
                    </div>
                    <span className="text-[9px] text-right" style={{ color: '#B0A090' }}>Goal: 8,000 steps</span>
                  </div>

                  <span className="text-[10px] text-center" style={{ color: '#B0A090' }}>{timeStr}</span>
                </motion.div>
              )}

              {/* ── SOS SCREEN ── */}
              {screen === 'sos' && (
                <motion.div
                  key="sos"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-3"
                  style={{ background: '#FDF5F5' }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: '#F4D4D4' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Shield size={24} className="text-[#C75B5B]" fill="#C75B5B" />
                  </motion.div>
                  <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#C75B5B' }}>
                    SOS Activated
                  </span>
                  <span className="text-[10px] text-center px-6" style={{ color: '#7A7A7A' }}>
                    Alerting James and emergency services…
                  </span>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom strap */}
      <div
        className="w-[72px] h-14 rounded-t-xl"
        style={{ background: 'linear-gradient(180deg, #B8976C 0%, #C4A882 100%)', boxShadow: '0 -2px 8px rgba(0,0,0,0.12)' }}
      />

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mt-5">

        {/* Screen tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: '#F0E8DC' }}
        >
          {([
            { id: 'main', icon: null, label: 'Clock' },
            { id: 'vitals', icon: null, label: 'Vitals' },
            { id: 'sos', icon: null, label: 'SOS' },
          ] as const).map((tab) => {
            const isActive = screen === tab.id
            const isSos = tab.id === 'sos'
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setScreen(tab.id)
                  if (tab.id === 'sos') activateEmergency()
                }}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px]"
                style={{
                  color: isActive ? (isSos ? '#C75B5B' : '#6B8C68') : '#7A7A7A',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="watchTabBg"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: isSos ? '#F4D4D4' : '#FFFFFF' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
            style={{ background: '#EAF2EA', color: '#6B8C68', border: '1px solid #C8DEC6' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#8FAE8B] animate-pulse" />
            Connected
          </div>
          {unreadAlerts > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: '#FAE8E8', color: '#C75B5B', border: '1px solid #E8C0C0' }}
            >
              {unreadAlerts} alert{unreadAlerts > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Date */}
        <span className="text-xs" style={{ color: '#B0A090' }}>{dateStr}</span>
      </div>
    </div>
  )
}
