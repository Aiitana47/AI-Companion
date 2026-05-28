'use client'

import { useCompanionStore, Appointment } from '@/lib/companion-store'
import { ArrowLeft, Calendar, Clock, MapPin, Video, Users, Stethoscope, Palette, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

function getTypeIcon(type: Appointment['type']) {
  switch (type) {
    case 'doctor':
      return <Stethoscope size={22} />
    case 'family':
      return <Video size={22} />
    case 'social':
      return <Users size={22} />
    case 'activity':
      return <Palette size={22} />
  }
}

function getTypeBarColor(type: Appointment['type']): string {
  switch (type) {
    case 'doctor':
      return 'bg-[var(--sage)]'
    case 'family':
      return 'bg-[var(--warm-orange)]'
    case 'social':
      return 'bg-purple-400'
    case 'activity':
      return 'bg-pink-400'
  }
}

function getTypeIconBg(type: Appointment['type']): string {
  switch (type) {
    case 'doctor':
      return 'bg-[var(--sage)]/15 text-[var(--sage-dark)]'
    case 'family':
      return 'bg-[var(--warm-orange)]/15 text-[var(--warm-orange)]'
    case 'social':
      return 'bg-purple-100 text-purple-600'
    case 'activity':
      return 'bg-pink-100 text-pink-600'
  }
}

export default function AppointmentsScreen() {
  const { appointments, goBack, showToast } = useCompanionStore()

  const nextAppointment = appointments.length > 0 ? appointments[0] : null
  const remainingAppointments = appointments.slice(1)

  const handleRemindMe = () => {
    if (nextAppointment) {
      showToast({
        title: 'Reminder Set',
        description: `We'll remind you about "${nextAppointment.title}"`,
        type: 'info',
      })
    }
  }

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
          Appointments
        </h1>

        {/* Spacer to balance the header */}
        <div className="w-[80px]" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Next Appointment highlight card */}
        {nextAppointment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35, ease: 'easeOut' }}
            className="rounded-2xl border-2 border-[var(--sage)] bg-white p-5 mb-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Type icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${getTypeIconBg(nextAppointment.type)}`}>
                {getTypeIcon(nextAppointment.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sage-dark)] mb-1">
                  Next Appointment
                </p>
                <h2 className="text-xl font-bold text-[var(--foreground)] leading-tight">
                  {nextAppointment.title}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-[var(--muted-foreground)]">
                  <Clock size={16} className="flex-shrink-0" />
                  <span className="text-base">{nextAppointment.date} &middot; {nextAppointment.time}</span>
                </div>

                {nextAppointment.location && (
                  <div className="flex items-center gap-2 mt-1 text-[var(--muted-foreground)]">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="text-base">{nextAppointment.location}</span>
                  </div>
                )}

                {nextAppointment.notes && (
                  <p className="text-sm italic text-[var(--muted-foreground)] mt-2">
                    {nextAppointment.notes}
                  </p>
                )}

                {/* Remind me button */}
                <motion.button
                  onClick={handleRemindMe}
                  className="mt-4 min-h-[44px] px-6 rounded-xl bg-[var(--sage)] hover:bg-[var(--sage-dark)] text-white font-semibold text-base flex items-center gap-2 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Set reminder for ${nextAppointment.title}`}
                >
                  <Calendar size={18} />
                  Remind me
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upcoming section header */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Upcoming
          </h3>
          <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-[var(--cream-dark)] text-sm font-semibold text-[var(--muted-foreground)] px-2">
            {appointments.length}
          </span>
        </div>

        {/* Appointment cards */}
        <div className="space-y-3 pb-2">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.15 + index * 0.07,
                duration: 0.35,
                ease: 'easeOut',
              }}
              className="flex items-stretch gap-3 bg-white border border-[var(--border)] rounded-2xl overflow-hidden"
            >
              {/* Colored icon bar */}
              <div className={`w-1 flex-shrink-0 rounded-l-2xl ${getTypeBarColor(appointment.type)}`} />

              {/* Icon */}
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center self-center ${getTypeIconBg(appointment.type)}`}>
                {getTypeIcon(appointment.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 py-3 pr-2">
                <h4 className="text-lg font-semibold text-[var(--foreground)] leading-tight">
                  {appointment.title}
                </h4>

                <div className="flex items-center gap-2 mt-1 text-[var(--muted-foreground)]">
                  <Clock size={14} className="flex-shrink-0" />
                  <span className="text-sm">{appointment.date} &middot; {appointment.time}</span>
                </div>

                {appointment.location && (
                  <div className="flex items-center gap-2 mt-0.5 text-[var(--muted-foreground)]">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="text-sm">{appointment.location}</span>
                  </div>
                )}

                {appointment.notes && (
                  <p className="text-sm italic text-[var(--muted-foreground)] mt-1">
                    {appointment.notes}
                  </p>
                )}
              </div>

              {/* Date badge on the right */}
              <div className="flex-shrink-0 flex items-center pr-3 self-center">
                <span className="inline-flex items-center justify-center rounded-full bg-[var(--cream)] text-sm font-semibold text-[var(--sage-dark)] px-3 py-1.5 min-h-[36px]">
                  {appointment.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {appointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Calendar size={40} className="text-[var(--cream-dark)] mb-3" />
            <p className="text-lg text-[var(--muted-foreground)]">
              No appointments scheduled
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
