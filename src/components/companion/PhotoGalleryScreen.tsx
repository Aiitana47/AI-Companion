'use client'

import { useState } from 'react'
import { useCompanionStore } from '@/lib/companion-store'
import { ArrowLeft, Heart, X, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Photo {
  id: string
  caption: string
  date: string
  gradient: string
  favorited: boolean
}

const initialPhotos: Photo[] = [
  { id: '1', caption: "Sarah's Birthday", date: 'Mar 15', gradient: 'from-pink-200 to-rose-300', favorited: false },
  { id: '2', caption: 'Garden Afternoon', date: 'Mar 12', gradient: 'from-green-200 to-emerald-300', favorited: true },
  { id: '3', caption: 'Sunday Brunch', date: 'Mar 10', gradient: 'from-amber-200 to-orange-300', favorited: false },
  { id: '4', caption: 'Walk in the Park', date: 'Mar 8', gradient: 'from-sky-200 to-blue-300', favorited: false },
  { id: '5', caption: 'Piano Practice', date: 'Mar 5', gradient: 'from-purple-200 to-violet-300', favorited: true },
  { id: '6', caption: 'Family Reunion', date: 'Mar 1', gradient: 'from-teal-200 to-cyan-300', favorited: false },
]

export default function PhotoGalleryScreen() {
  const { goBack } = useCompanionStore()
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const toggleFavorite = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorited: !p.favorited } : p))
    )
  }

  return (
    <div className="flex flex-col px-6 py-6 min-h-[540px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-5"
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[var(--sage)] hover:text-[var(--sage-dark)] transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Family Photos</h1>
        <div className="w-[70px]" />
      </motion.div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
              whileHover={{ scale: 1.04 }}
              className="rounded-2xl overflow-hidden bg-white border border-[var(--border)] cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Gradient placeholder for photo */}
              <div
                className={`w-full h-28 bg-gradient-to-br ${photo.gradient} flex items-center justify-center`}
              >
                <span className="text-4xl opacity-60">📷</span>
              </div>

              {/* Caption & Info */}
              <div className="p-3">
                <p className="text-base font-semibold text-[var(--foreground)] leading-tight truncate">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Calendar size={11} />
                    <span>{photo.date}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(photo.id)
                    }}
                    className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-[var(--cream-dark)] transition-colors"
                    aria-label={photo.favorited ? 'Unfavorite' : 'Favorite'}
                  >
                    <Heart
                      size={18}
                      className={
                        photo.favorited
                          ? 'fill-[var(--emergency)] text-[var(--emergency)]'
                          : 'text-[var(--muted-foreground)]'
                      }
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative mx-4 w-full max-w-[400px] rounded-3xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Large Gradient Photo */}
              <div
                className={`w-full h-56 bg-gradient-to-br ${selectedPhoto.gradient} flex items-center justify-center`}
              >
                <span className="text-7xl opacity-50">📷</span>
              </div>

              {/* Details */}
              <div className="p-5">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
                  {selectedPhoto.caption}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-4">
                  <Calendar size={14} />
                  <span>{selectedPhoto.date}</span>
                </div>
                <button
                  onClick={() => {
                    toggleFavorite(selectedPhoto.id)
                    setSelectedPhoto({ ...selectedPhoto, favorited: !selectedPhoto.favorited })
                  }}
                  className="flex items-center justify-center gap-2 w-full min-h-[48px] rounded-xl bg-[var(--cream-dark)] hover:bg-[var(--cream-dark)]/80 text-[var(--foreground)] font-semibold text-base transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      selectedPhoto.favorited
                        ? 'fill-[var(--emergency)] text-[var(--emergency)]'
                        : 'text-[var(--muted-foreground)]'
                    }
                  />
                  {selectedPhoto.favorited ? 'Unfavorite' : 'Add to Favorites'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
