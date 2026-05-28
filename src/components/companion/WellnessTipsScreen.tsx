'use client'

import { useState } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

type WellnessCategory = 'physical' | 'mental' | 'social' | 'nutrition'

interface WellnessTip {
  id: string
  emoji: string
  title: string
  description: string
  category: WellnessCategory
}

const wellnessTips: WellnessTip[] = [
  { id: '1', emoji: '🚶', title: 'Morning Walk', description: 'A 15-minute walk can boost your mood and energy for the whole day', category: 'physical' },
  { id: '2', emoji: '🧘', title: 'Deep Breathing', description: 'Try 5 minutes of slow, deep breaths to calm your mind', category: 'mental' },
  { id: '3', emoji: '📞', title: 'Call a Friend', description: 'Social connection is key to emotional well-being', category: 'social' },
  { id: '4', emoji: '🥛', title: 'Stay Hydrated', description: 'Drink at least 6 glasses of water throughout the day', category: 'nutrition' },
  { id: '5', emoji: '😴', title: 'Sleep Routine', description: 'Going to bed at the same time helps you sleep better', category: 'mental' },
]

function getCategoryStyles(category: WellnessCategory): { bg: string; text: string; tag: string } {
  switch (category) {
    case 'physical':
      return { bg: 'bg-[var(--sage)]/10', text: 'text-[var(--sage-dark)]', tag: 'Physical' }
    case 'mental':
      return { bg: 'bg-purple-100', text: 'text-purple-700', tag: 'Mental' }
    case 'social':
      return { bg: 'bg-[var(--warm-orange)]/10', text: 'text-[var(--warm-orange)]', tag: 'Social' }
    case 'nutrition':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', tag: 'Nutrition' }
  }
}

function getCategoryTagStyles(category: WellnessCategory): string {
  switch (category) {
    case 'physical':
      return 'bg-[var(--sage)]/15 text-[var(--sage-dark)]'
    case 'mental':
      return 'bg-purple-100 text-purple-700'
    case 'social':
      return 'bg-[var(--warm-orange)]/15 text-[var(--warm-orange)]'
    case 'nutrition':
      return 'bg-emerald-100 text-emerald-700'
  }
}

export default function WellnessTipsScreen() {
  const { goBack } = useCompanionStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [featuredIndex, setFeaturedIndex] = useState(0)

  const currentDate = new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setFeaturedIndex((prev) => (prev + 1) % wellnessTips.length)
      setIsRefreshing(false)
    }, 1000)
  }

  const featured = wellnessTips[featuredIndex]
  const featuredStyles = getCategoryStyles(featured.category)

  return (
    <div className="flex flex-col px-6 py-6 min-h-[540px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-4"
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[var(--sage)] hover:text-[var(--sage-dark)] transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Wellness Tips</h1>
        <div className="w-[70px]" />
      </motion.div>

      {/* Date */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-sm text-[var(--muted-foreground)] mb-5"
      >
        {currentDate}
      </motion.p>

      {/* Featured Tip Card */}
      <motion.div
        key={featured.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-5 rounded-2xl p-5 shadow-md"
        style={{
          background: 'linear-gradient(135deg, var(--sage) 0%, var(--sage-dark) 100%)',
        }}
      >
        <div className="flex items-start gap-4">
          <span className="text-5xl leading-none">{featured.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-white/80" />
              <span className="text-xs font-medium text-white/80 uppercase tracking-wide">Featured Tip</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{featured.title}</h2>
            <p className="text-base text-white/85 leading-snug">{featured.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Tips List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-4">
        {wellnessTips.map((tip, index) => {
          const styles = getCategoryStyles(tip.category)
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.07, duration: 0.35 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[var(--border)] cursor-default"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${styles.bg} flex items-center justify-center`}>
                <span className="text-2xl leading-none">{tip.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--foreground)] leading-tight">{tip.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-0.5 leading-snug">{tip.description}</p>
                <span className={`inline-block mt-2 text-xs font-medium rounded-full px-2.5 py-0.5 ${getCategoryTagStyles(tip.category)}`}>
                  {styles.tag}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Refresh Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center justify-center gap-2 w-full min-h-[48px] rounded-xl bg-[var(--warm-orange)] hover:bg-[var(--warm-orange)]/90 text-white font-semibold text-base transition-colors disabled:opacity-60"
        aria-label="Refresh tips"
      >
        {isRefreshing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={20} />
          </motion.div>
        ) : (
          <RefreshCw size={20} />
        )}
        {isRefreshing ? 'Loading...' : 'Refresh Tips'}
      </motion.button>
    </div>
  )
}
