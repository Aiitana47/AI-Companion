'use client'

import { useState, useRef, useEffect } from 'react'
import { useCompanionStore, type ChatMessage } from '@/lib/companion-store'
import { ArrowLeft, Send, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FamilyMessagesScreen() {
  const { chatMessages, addChatMessage, markChatMessageRead, goBack } = useCompanionStore()
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mark all messages as read on open
  useEffect(() => {
    chatMessages.forEach((msg) => {
      if (!msg.read) markChatMessageRead(msg.id)
    })
  }, [chatMessages, markChatMessageRead])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSend = () => {
    if (!inputText.trim()) return
    addChatMessage({
      sender: 'james',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    })
    setInputText('')

    // Simulate system reply after 2 seconds
    setTimeout(() => {
      addChatMessage({
        sender: 'system',
        text: 'Message delivered to Martha\'s display.',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        read: true,
      })
    }, 2000)
  }

  const getSenderInfo = (sender: ChatMessage['sender']) => {
    if (sender === 'james') {
      return { name: 'You', icon: User, color: 'bg-[var(--sage)]' }
    }
    return { name: 'Companion', icon: Bot, color: 'bg-[var(--warm-orange)]' }
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen flex flex-col bg-[var(--cream)]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-[var(--cream)]/90 backdrop-blur-sm px-5 pt-4 pb-3 border-b border-[var(--cream-dark)]"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-[var(--cream-dark)] hover:bg-[var(--cream-dark)] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Messages</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Chat with Martha via Companion</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--sage)] flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
        </div>
      </motion.header>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-3"
      >
        <AnimatePresence>
          {chatMessages.map((msg, index) => {
            const info = getSenderInfo(msg.sender)
            const Icon = info.icon
            const isJames = msg.sender === 'james'

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-end gap-2 ${isJames ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full ${info.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={14} className="text-white" />
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isJames
                      ? 'bg-[var(--sage)] text-white rounded-br-sm'
                      : 'bg-white text-[var(--foreground)] border border-[var(--border)] rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isJames ? 'text-white/60' : 'text-[var(--muted-foreground)]'}`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {chatMessages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)]">
            <div className="w-16 h-16 rounded-full bg-[var(--cream-dark)] flex items-center justify-center mb-3">
              <Send size={24} className="text-[var(--muted-foreground)]" />
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">Send a message to Martha</p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-white border-t border-[var(--cream-dark)] px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-[var(--cream)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] border border-[var(--border)] focus:outline-none focus:border-[var(--sage)] focus:ring-1 focus:ring-[var(--sage)]/30 transition-colors min-h-[44px]"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              inputText.trim()
                ? 'bg-[var(--sage)] text-white hover:bg-[var(--sage-dark)]'
                : 'bg-[var(--cream-dark)] text-[var(--muted-foreground)]'
            }`}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
