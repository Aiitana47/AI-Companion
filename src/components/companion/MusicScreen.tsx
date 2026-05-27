'use client'

import { useEffect } from 'react'
import { useCompanionStore, MusicTrack, Screen } from '@/lib/companion-store'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react'
import { motion } from 'framer-motion'

const playlist: (MusicTrack & { screen: Screen })[] = [
  { id: '1', title: 'Nessun Dorma', artist: 'Luciano Pavarotti', duration: '3:25', coverEmoji: '🎭', genre: 'Opera', screen: 'music' },
  { id: '2', title: 'Clair de Lune', artist: 'Claude Debussy', duration: '5:12', coverEmoji: '🌙', genre: 'Classical', screen: 'music' },
  { id: '3', title: 'What a Wonderful World', artist: 'Louis Armstrong', duration: '2:21', coverEmoji: '🌍', genre: 'Jazz', screen: 'music' },
  { id: '4', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', duration: '2:30', coverEmoji: '🚀', genre: 'Jazz', screen: 'music' },
  { id: '5', title: 'Ave Maria', artist: 'Andrea Bocelli', duration: '4:15', coverEmoji: '⛪', genre: 'Classical', screen: 'music' },
]

export default function MusicScreen() {
  const {
    currentTrack,
    isPlaying,
    musicProgress,
    goBack,
    togglePlayPause,
    setCurrentTrack,
    setIsPlaying,
    setMusicProgress,
  } = useCompanionStore()

  // Simulated progress animation: increment by ~0.5 every 100ms when playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const current = useCompanionStore.getState().musicProgress
      if (current >= 100) {
        setMusicProgress(0)
      } else {
        setMusicProgress(Math.min(current + 0.5, 100))
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, setMusicProgress])

  const handleTrackSelect = (track: MusicTrack & { screen: Screen }) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const formatProgress = (progress: number, duration: string): string => {
    if (!duration) return '0:00'
    const parts = duration.split(':')
    const totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
    const currentSeconds = Math.floor((progress / 100) * totalSeconds)
    const mins = Math.floor(currentSeconds / 60)
    const secs = currentSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col px-6 py-6 min-h-[540px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[var(--sage)] hover:text-[var(--sage-dark)] transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Music</h1>
        <div className="w-[70px]" /> {/* Spacer to center title */}
      </motion.div>

      {/* Album Cover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center mb-5"
      >
        <div className="w-full max-w-[280px] min-h-[200px] rounded-2xl bg-white shadow-lg flex items-center justify-center">
          <span className="text-8xl" role="img" aria-label={currentTrack?.genre || 'Album cover'}>
            {currentTrack?.coverEmoji || '🎵'}
          </span>
        </div>
      </motion.div>

      {/* Song Title & Artist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-center mb-4"
      >
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {currentTrack?.title || 'No Track Selected'}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)]">
          {currentTrack?.artist || '—'}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="mb-4"
      >
        <div className="w-full h-2 rounded-full bg-[var(--cream-dark)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${musicProgress}%`,
              background: 'linear-gradient(to right, var(--sage), var(--sage-dark))',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-sm text-[var(--muted-foreground)]">
            {currentTrack ? formatProgress(musicProgress, currentTrack.duration) : '0:00'}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            {currentTrack?.duration || '0:00'}
          </span>
        </div>
      </motion.div>

      {/* Transport Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center justify-center gap-8 mb-5"
      >
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full text-[var(--foreground)] hover:bg-[var(--cream-dark)] transition-colors"
          aria-label="Skip back"
        >
          <SkipBack size={28} />
        </button>
        <button
          onClick={togglePlayPause}
          className="w-16 h-16 rounded-full bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white flex items-center justify-center shadow-md transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
        </button>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full text-[var(--foreground)] hover:bg-[var(--cream-dark)] transition-colors"
          aria-label="Skip forward"
        >
          <SkipForward size={28} />
        </button>
      </motion.div>

      {/* Volume Slider */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="flex items-center gap-3 mb-6 px-2"
      >
        <Volume2 size={22} className="text-[var(--muted-foreground)] flex-shrink-0" />
        <div className="flex-1 relative h-3 flex items-center">
          <div className="w-full h-2 rounded-full bg-[var(--cream-dark)]">
            <div
              className="h-full rounded-full bg-[var(--sage)]"
              style={{ width: '70%' }}
            />
          </div>
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-[var(--sage)] shadow-sm"
            style={{ left: 'calc(70% - 10px)' }}
          />
        </div>
      </motion.div>

      {/* Playlist */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex-1"
      >
        <div className="flex items-center gap-2 mb-3">
          <Music size={20} className="text-[var(--sage)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Playlist</h3>
        </div>
        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
          {playlist.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id
            return (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + index * 0.07 }}
                onClick={() => handleTrackSelect(track)}
                className={`
                  w-full flex items-center gap-4 p-3 rounded-xl transition-colors min-h-[44px] text-left
                  ${isCurrentTrack
                    ? 'bg-[var(--sage)]/15 border border-[var(--sage)]/25'
                    : 'bg-[var(--cream)] hover:bg-[var(--cream-dark)] border border-transparent'
                  }
                `}
                aria-label={`Play ${track.title} by ${track.artist}`}
                aria-current={isCurrentTrack && isPlaying ? 'true' : undefined}
              >
                <span className="text-3xl flex-shrink-0" role="img" aria-label={track.genre}>
                  {track.coverEmoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-semibold truncate ${isCurrentTrack ? 'text-[var(--sage-dark)]' : 'text-[var(--foreground)]'}`}>
                    {track.title}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] truncate">
                    {track.artist}
                  </p>
                </div>
                <span className="text-sm text-[var(--muted-foreground)] flex-shrink-0">
                  {track.duration}
                </span>
                {isCurrentTrack && isPlaying && (
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <motion.span
                      className="w-1 bg-[var(--sage)] rounded-full"
                      animate={{ height: [8, 16, 8] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="w-1 bg-[var(--sage)] rounded-full"
                      animate={{ height: [12, 8, 12] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1 bg-[var(--sage)] rounded-full"
                      animate={{ height: [6, 14, 6] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
