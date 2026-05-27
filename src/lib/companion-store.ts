import { create } from 'zustand'

export type Screen = 
  | 'home' 
  | 'mood-checkin' 
  | 'medication-reminder' 
  | 'menu' 
  | 'proactive-suggestion'
  | 'profile' 
  | 'alerts' 
  | 'emergency'
  | 'family-dashboard'
  | 'family-weekly-report'
  | 'call-screen'
  | 'music'
  | 'activities'
  | 'appointments'
  | 'family-messages'
  | 'family-settings'

export type ViewMode = 'martha' | 'james'

export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | null

export interface Medication {
  id: string
  name: string
  time: string
  taken: boolean
  dosage: string
}

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'emergency'
  title: string
  description: string
  time: string
  read: boolean
}

export interface WeeklyReport {
  moodTrend: number
  moodChange: string
  topInsight: string
  sleepAverage: string
  medicationAdherence: number
  socialInteractions: number
  recommendations: string[]
}

export interface ToastData {
  id: string
  title: string
  description?: string
  type: 'info' | 'warning' | 'medication' | 'message'
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  duration: string
  coverEmoji: string
  genre: string
}

export interface Appointment {
  id: string
  title: string
  date: string
  time: string
  type: 'doctor' | 'social' | 'activity' | 'family'
  location?: string
  notes?: string
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  emoji: string
  category: 'physical' | 'mental' | 'social' | 'creative'
  duration: string
  completed: boolean
}

export interface ChatMessage {
  id: string
  sender: 'james' | 'system'
  text: string
  time: string
  read: boolean
}

interface CompanionState {
  // Navigation
  currentScreen: Screen
  viewMode: ViewMode
  previousScreen: Screen | null
  navigationDirection: 'forward' | 'backward' | null
  
  // Martha's state
  userName: string
  currentTime: string
  currentDate: string
  mood: MoodType
  isListening: boolean
  isSpeaking: boolean
  aiMessage: string
  aiChatMessage: string | null
  aiChatVisible: boolean
  
  // Mic/AI chat state
  micState: 'idle' | 'listening' | 'processing'
  
  // Medications
  medications: Medication[]
  
  // Alerts
  alerts: Alert[]
  
  // Weekly report
  weeklyReport: WeeklyReport
  
  // Emergency
  isEmergencyActive: boolean
  
  // Call
  isCallActive: boolean
  callType: 'audio' | 'video' | null
  callWith: string
  
  // Toast
  toast: ToastData | null
  
  // Proactive check-in banner
  showProactiveBanner: boolean
  
  // Music
  currentTrack: MusicTrack | null
  isPlaying: boolean
  musicProgress: number // 0-100
  
  // Appointments
  appointments: Appointment[]
  
  // Activities
  activities: ActivityItem[]
  
  // Chat messages
  chatMessages: ChatMessage[]
  
  // Actions
  setScreen: (screen: Screen) => void
  setViewMode: (mode: ViewMode) => void
  setMood: (mood: MoodType) => void
  setIsListening: (listening: boolean) => void
  setIsSpeaking: (speaking: boolean) => void
  setAiMessage: (message: string) => void
  setAiChatMessage: (message: string | null) => void
  setAiChatVisible: (visible: boolean) => void
  setMicState: (state: 'idle' | 'listening' | 'processing') => void
  markMedicationTaken: (id: string) => void
  markAlertRead: (id: string) => void
  activateEmergency: () => void
  deactivateEmergency: () => void
  startCall: (type: 'audio' | 'video', with_: string) => void
  endCall: () => void
  goBack: () => void
  showToast: (toast: Omit<ToastData, 'id'>) => void
  dismissToast: () => void
  setShowProactiveBanner: (show: boolean) => void
  setCurrentTrack: (track: MusicTrack | null) => void
  setIsPlaying: (playing: boolean) => void
  setMusicProgress: (progress: number) => void
  togglePlayPause: () => void
  markActivityCompleted: (id: string) => void
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void
  markChatMessageRead: (id: string) => void
}

const initialMedications: Medication[] = [
  { id: '1', name: 'Blood Pressure Medication', time: '09:00', taken: false, dosage: '1 tablet' },
  { id: '2', name: 'Vitamin D', time: '12:00', taken: false, dosage: '1 capsule' },
  { id: '3', name: 'Magnesium', time: '20:00', taken: false, dosage: '2 tablets' },
]

const initialAlerts: Alert[] = [
  { id: '1', type: 'info', title: 'Walk completed', description: 'Martha returned from her walk at 15:00', time: '15:00', read: false },
  { id: '2', type: 'warning', title: 'Medication missed', description: 'Magnesium was not taken yesterday evening', time: '20:30', read: false },
  { id: '3', type: 'info', title: 'Good mood detected', description: 'Martha seemed cheerful during the morning conversation', time: '10:00', read: true },
  { id: '4', type: 'info', title: 'Music played', description: 'Opera playlist was played for 45 minutes', time: '11:00', read: true },
]

const initialWeeklyReport: WeeklyReport = {
  moodTrend: 72,
  moodChange: '+15% after time with loved ones',
  topInsight: 'Speech pace improved on days with social contact',
  sleepAverage: '7h 20min',
  medicationAdherence: 89,
  socialInteractions: 5,
  recommendations: [
    'Talk to Martha about lemon cupcakes — she mentioned them while cooking',
    'Buy magnesium pills — stock is running low',
    'Schedule a video call on Thursday evening — that\'s when she feels loneliest',
  ],
}

const initialMusicTrack: MusicTrack = {
  id: '1',
  title: 'Nessun Dorma',
  artist: 'Luciano Pavarotti',
  duration: '3:25',
  coverEmoji: '🎭',
  genre: 'Opera',
}

const initialAppointments: Appointment[] = [
  { id: '1', title: 'Dr. Martinez Check-up', date: 'Tomorrow', time: '10:00', type: 'doctor', location: 'Health Centre, Room 204', notes: 'Bring blood pressure log' },
  { id: '2', title: 'Video Call with Sarah', date: 'Thu', time: '18:00', type: 'family' },
  { id: '3', title: 'Garden Club Meeting', date: 'Sat', time: '11:00', type: 'social', location: 'Community Hall' },
  { id: '4', title: 'Piano Lesson', date: 'Next Mon', time: '15:00', type: 'activity', location: 'Music Room' },
]

const initialActivities: ActivityItem[] = [
  { id: '1', title: 'Morning Stretch', description: '5-minute gentle stretching routine', emoji: '🧘', category: 'physical', duration: '5 min', completed: true },
  { id: '2', title: 'Word Puzzle', description: 'Today\'s crossword puzzle', emoji: '🧩', category: 'mental', duration: '15 min', completed: true },
  { id: '3', title: 'Walk in the Garden', description: 'A short walk around the garden', emoji: '🌿', category: 'physical', duration: '20 min', completed: false },
  { id: '4', title: 'Call a Friend', description: 'Reach out to Margaret', emoji: '📞', category: 'social', duration: '10 min', completed: false },
  { id: '5', title: 'Painting', description: 'Watercolour painting session', emoji: '🎨', category: 'creative', duration: '30 min', completed: false },
  { id: '6', title: 'Memory Game', description: 'Match the pairs card game', emoji: '🃏', category: 'mental', duration: '10 min', completed: false },
]

const initialChatMessages: ChatMessage[] = [
  { id: '1', sender: 'james', text: 'Hi Mum! How was your walk today?', time: '17:02', read: true },
  { id: '2', sender: 'system', text: 'Martha had a lovely walk in the garden this afternoon.', time: '17:02', read: true },
  { id: '3', sender: 'james', text: 'That\'s wonderful! I\'ll call you later tonight. Love you! 💛', time: '17:05', read: false },
]

let toastIdCounter = 0
let chatIdCounter = initialChatMessages.length

export const useCompanionStore = create<CompanionState>((set, get) => ({
  // Navigation
  currentScreen: 'home',
  viewMode: 'martha',
  previousScreen: null,
  navigationDirection: null,
  
  // Martha's state
  userName: 'Martha',
  currentTime: '10:24',
  currentDate: 'Fri, Mar 21',
  mood: null,
  isListening: false,
  isSpeaking: false,
  aiMessage: "Good morning, Martha. How can I help you today?",
  aiChatMessage: null,
  aiChatVisible: false,
  micState: 'idle',
  
  // Medications
  medications: initialMedications,
  
  // Alerts
  alerts: initialAlerts,
  
  // Weekly report
  weeklyReport: initialWeeklyReport,
  
  // Emergency
  isEmergencyActive: false,
  
  // Call
  isCallActive: false,
  callType: null,
  callWith: '',
  
  // Toast
  toast: null,
  
  // Proactive banner
  showProactiveBanner: false,
  
  // Music
  currentTrack: initialMusicTrack,
  isPlaying: false,
  musicProgress: 0,
  
  // Appointments
  appointments: initialAppointments,
  
  // Activities
  activities: initialActivities,
  
  // Chat messages
  chatMessages: initialChatMessages,
  
  // Actions
  setScreen: (screen) => set((state) => {
    const direction = getNavigationDirection(state.currentScreen, screen)
    return {
      previousScreen: state.currentScreen, 
      currentScreen: screen,
      navigationDirection: direction,
    }
  }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setMood: (mood) => set({ mood }),
  
  setIsListening: (listening) => set({ isListening: listening }),
  
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
  
  setAiMessage: (message) => set({ aiMessage: message }),
  
  setAiChatMessage: (message) => set({ aiChatMessage: message }),
  
  setAiChatVisible: (visible) => set({ aiChatVisible: visible }),
  
  setMicState: (state) => set({ micState: state }),
  
  markMedicationTaken: (id) => set((state) => ({
    medications: state.medications.map(m => 
      m.id === id ? { ...m, taken: true } : m
    )
  })),
  
  markAlertRead: (id) => set((state) => ({
    alerts: state.alerts.map(a => 
      a.id === id ? { ...a, read: true } : a
    )
  })),
  
  activateEmergency: () => set({ isEmergencyActive: true, currentScreen: 'emergency' }),
  
  deactivateEmergency: () => set({ isEmergencyActive: false, currentScreen: 'home' }),
  
  startCall: (type, with_) => set({ 
    isCallActive: true, 
    callType: type, 
    callWith: with_,
    currentScreen: 'call-screen'
  }),
  
  endCall: () => set({ 
    isCallActive: false, 
    callType: null, 
    callWith: '',
    currentScreen: 'home'
  }),
  
  goBack: () => set((state) => ({
    currentScreen: state.previousScreen || 'home',
    previousScreen: null,
    navigationDirection: 'backward',
  })),
  
  showToast: (toastData) => set({
    toast: { ...toastData, id: String(++toastIdCounter) }
  }),
  
  dismissToast: () => set({ toast: null }),
  
  setShowProactiveBanner: (show) => set({ showProactiveBanner: show }),
  
  setCurrentTrack: (track) => set({ currentTrack: track, musicProgress: 0 }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setMusicProgress: (progress) => set({ musicProgress: progress }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  markActivityCompleted: (id) => set((state) => ({
    activities: state.activities.map(a => 
      a.id === id ? { ...a, completed: true } : a
    )
  })),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, { ...message, id: String(++chatIdCounter) }]
  })),
  markChatMessageRead: (id) => set((state) => ({
    chatMessages: state.chatMessages.map(m => 
      m.id === id ? { ...m, read: true } : m
    )
  })),
}))

// Helper to determine navigation direction for animations
function getNavigationDirection(_from: Screen, to: Screen): 'forward' | 'backward' {
  const forwardScreens: Screen[] = ['menu', 'mood-checkin', 'medication-reminder', 'proactive-suggestion', 'profile', 'alerts', 'emergency', 'call-screen', 'family-weekly-report', 'music', 'activities', 'appointments', 'family-messages', 'family-settings']
  if (forwardScreens.includes(to)) return 'forward'
  return 'backward'
}
