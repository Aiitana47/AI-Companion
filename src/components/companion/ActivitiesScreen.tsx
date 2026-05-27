'use client'

import { useState, useMemo } from 'react'
import { useCompanionStore, ActivityItem } from '@/lib/companion-store'
import { ArrowLeft, Check, Star } from 'lucide-react'
import { motion } from 'framer-motion'

type CategoryFilter = 'All' | 'Physical' | 'Mental' | 'Social' | 'Creative'

const categoryTabs: CategoryFilter[] = ['All', 'Physical', 'Mental', 'Social', 'Creative']

function getCategoryTagClasses(category: ActivityItem['category']): string {
  switch (category) {
    case 'physical':
      return 'bg-[var(--sage)]/15 text-[var(--sage-dark)]'
    case 'mental':
      return 'bg-purple-100 text-purple-700'
    case 'social':
      return 'bg-[var(--warm-orange)]/15 text-[var(--warm-orange)]'
    case 'creative':
      return 'bg-pink-100 text-pink-700'
    default:
      return 'bg-[var(--cream-dark)] text-[var(--muted-foreground)]'
  }
}

function getCategoryLabel(category: ActivityItem['category']): string {
  switch (category) {
    case 'physical': return 'Physical'
    case 'mental': return 'Mental'
    case 'social': return 'Social'
    case 'creative': return 'Creative'
    default: return category
  }
}

function matchesFilter(activity: ActivityItem, filter: CategoryFilter): boolean {
  if (filter === 'All') return true
  return getCategoryLabel(activity.category) === filter
}

export default function ActivitiesScreen() {
  const { activities, markActivityCompleted, goBack } = useCompanionStore()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')

  const filteredActivities = useMemo(
    () => activities.filter((a) => matchesFilter(a, categoryFilter)),
    [activities, categoryFilter]
  )

  const completedCount = activities.filter((a) => a.completed).length
  const totalCount = activities.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col px-6 py-6 min-h-[540px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-h-[44px] min-w-[44px] transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>

        <h1 className="text-xl font-bold text-[var(--foreground)]">
          Today&apos;s Activities
        </h1>

        {/* Spacer to balance the header */}
        <div className="w-[80px]" />
      </div>

      {/* Progress summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-semibold text-[var(--foreground)]">
            {completedCount} of {totalCount} completed
          </span>
          <span className="text-sm font-medium text-[var(--sage-dark)]">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[var(--cream-dark)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full bg-[var(--sage)]"
          />
        </div>
      </motion.div>

      {/* Category filter tabs */}
      <div className="mb-5 -mx-6 px-6 overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 pb-1">
          {categoryTabs.map((tab) => {
            const isActive = categoryFilter === tab
            return (
              <button
                key={tab}
                onClick={() => setCategoryFilter(tab)}
                className={`
                  flex-shrink-0 min-h-[44px] px-5 rounded-full text-base font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-[var(--sage)] text-white shadow-sm'
                      : 'bg-[var(--cream-dark)] text-[var(--muted-foreground)] hover:bg-[var(--sage)]/10 hover:text-[var(--sage-dark)]'
                  }
                `}
                aria-label={`Filter by ${tab}`}
                aria-pressed={isActive}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Activities list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Star size={40} className="text-[var(--cream-dark)] mb-3" />
            <p className="text-lg text-[var(--muted-foreground)]">
              No activities in this category
            </p>
          </div>
        ) : (
          filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + index * 0.07,
                duration: 0.35,
                ease: 'easeOut',
              }}
              className={`
                flex items-start gap-4 p-4 rounded-2xl bg-white border border-[var(--border)] transition-opacity
                ${activity.completed ? 'opacity-60' : 'opacity-100'}
              `}
            >
              {/* Emoji */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--cream)] flex items-center justify-center">
                <span className="text-3xl leading-none">{activity.emoji}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-semibold leading-tight ${
                    activity.completed
                      ? 'line-through text-[var(--muted-foreground)]'
                      : 'text-[var(--foreground)]'
                  }`}
                >
                  {activity.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                  {activity.description}
                </p>

                {/* Tags row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {/* Duration badge */}
                  <span className="text-xs bg-[var(--cream-dark)] rounded-full px-2 py-0.5 text-[var(--muted-foreground)]">
                    {activity.duration}
                  </span>
                  {/* Category tag */}
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${getCategoryTagClasses(activity.category)}`}
                  >
                    {getCategoryLabel(activity.category)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0 self-center">
                {activity.completed ? (
                  <div className="w-10 h-10 rounded-full bg-[var(--sage)] flex items-center justify-center">
                    <Check size={20} className="text-white" />
                  </div>
                ) : (
                  <motion.button
                    onClick={() => markActivityCompleted(activity.id)}
                    className="min-h-[44px] min-w-[44px] px-4 rounded-full bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-semibold text-sm transition-colors"
                    whileTap={{ scale: 0.92 }}
                    aria-label={`Mark ${activity.title} as completed`}
                  >
                    Do it
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
