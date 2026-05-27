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

let toastIdCounter = 0

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
}))

// Helper to determine navigation direction for animations
function getNavigationDirection(_from: Screen, to: Screen): 'forward' | 'backward' {
  const forwardScreens: Screen[] = ['menu', 'mood-checkin', 'medication-reminder', 'proactive-suggestion', 'profile', 'alerts', 'emergency', 'call-screen', 'family-weekly-report']
  if (forwardScreens.includes(to)) return 'forward'
  return 'backward'
}
