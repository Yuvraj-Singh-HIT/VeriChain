import React, { useState } from 'react'
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles } from 'lucide-react'

const config = {
  initialMessages: [
    {
      type: 'text',
      message: 'Hello! I am Weilliptic AI. How can I help you with invoice financing today?',
      id: 1,
    },
  ],
  botName: 'Weilliptic AI',
  customStyles: {
    botMessageBox: {
      backgroundColor: 'transparent',
      color: '#000000',
      borderRadius: '16px',
      padding: '12px 16px',
      boxShadow: 'none',
    },
    chatButton: {
      backgroundColor: 'transparent',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      boxShadow: 'none',
    },
    chatWindow: {
      backgroundColor: 'transparent',
      borderRadius: '20px',
      boxShadow: 'none',
      border: 'none',
    },
    header: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      borderRadius: '20px 20px 0 0',
      padding: '16px',
      boxShadow: 'none',
    },
    userMessageBox: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      borderRadius: '16px',
      padding: '12px 16px',
      boxShadow: 'none',
    },
  },
}

const MessageParser = ({ children, actions }: any) => {
  const parse = (message: string) => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('create') && lowerMessage.includes('invoice')) {
      actions.handleCreateInvoice()
    } else if (lowerMessage.includes('fund') || lowerMessage.includes('invest')) {
      actions.handleFundInvoice()
    } else if (lowerMessage.includes('marketplace') || lowerMessage.includes('browse')) {
      actions.handleMarketplace()
    } else if (lowerMessage.includes('risk') || lowerMessage.includes('score')) {
      actions.handleRiskScoring()
    } else {
      actions.handleDefault()
    }
  }

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        })
      })}
    </div>
  )
}

const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
  const handleCreateInvoice = () => {
    const botMessage = createChatBotMessage(
      '🚀 To create an invoice NFT:\n\n1. Go to MSME Dashboard (/msme)\n2. Fill in invoice details\n3. I\'ll automatically calculate risk scores\n4. Mint your invoice as an NFT!\n\nNeed help with any step?'
    )

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  const handleFundInvoice = () => {
    const botMessage = createChatBotMessage(
      '💰 Ready to invest?\n\n📊 Check the Marketplace (/marketplace) for available invoices\n🎯 Review risk scores before funding\n💡 Higher returns come with higher risk\n\nI can help you analyze opportunities!'
    )

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  const handleMarketplace = () => {
    const botMessage = createChatBotMessage(
      '🛒 Welcome to the Invoice Marketplace!\n\n🔍 Browse tokenized invoices from MSMEs\n📈 View real-time risk assessments\n💹 Fund promising opportunities\n⚡ Get immediate liquidity solutions\n\nWhat type of investment are you looking for?'
    )

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  const handleRiskScoring = () => {
    const botMessage = createChatBotMessage(
      '🎯 Risk Scoring Intelligence:\n\n📊 Low Risk (Green): <30 - Very Safe\n⚠️ Medium Risk (Yellow): 30-70 - Balanced\n🚨 High Risk (Red): >70 - High Reward Potential\n\nFactors considered:\n• Invoice amount\n• Due date proximity\n• Buyer creditworthiness\n\nWant me to analyze a specific invoice?'
    )

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  const handleDefault = () => {
    const botMessage = createChatBotMessage(
      '🤖 I\'m Weilliptic AI, your invoice financing expert!\n\n💡 I can help with:\n• Creating invoice NFTs\n• Finding investment opportunities\n• Understanding risk scores\n• Navigating the marketplace\n\nWhat would you like to explore?'
    )

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleCreateInvoice,
            handleFundInvoice,
            handleMarketplace,
            handleRiskScoring,
            handleDefault,
          },
        })
      })}
    </div>
  )
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Custom Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 rounded-full chatbot-button transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Animated background rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-ping opacity-20" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-40 animate-pulse" />

              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-7 h-7 text-white chatbot-sparkle" />
              </motion.div>

              {/* Floating particles */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ y: [-4, -8, -4], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full"
                animate={{ y: [4, 8, 4], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
            >
              Ask Weilliptic AI
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px]"
          >
            <div className="relative w-full h-full">
              {/* Close Button */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>

              {/* Chatbot */}
              <div className="w-full h-full rounded-2xl overflow-hidden chatbot-window">
                <Chatbot
                  config={config}
                  messageParser={MessageParser}
                  actionProvider={ActionProvider}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatbot