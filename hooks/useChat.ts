"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./useWallet"
import { useContract } from "./useContract"
import { Message, ChatUser } from "@/types/chat"

export function useChat() {
  const { address } = useWallet()
  const { getENSByAddress, getAllRegistrations } = useContract()

  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null)
  const [chatPartner, setChatPartner] = useState<ChatUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Load current user info
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!address) return

      try {
        const ensName = await getENSByAddress(address)
        if (ensName) {
          const registrations = await getAllRegistrations()
          const userReg = registrations.find((r) => r.ensName === ensName)
          if (userReg) {
            setCurrentUser({
              address,
              ensName: userReg.ensName,
              displayName: userReg.displayName,
              profileImageHash: userReg.profileImageHash,
              isOnline: true,
              lastSeen: Date.now(),
            })
          }
        }
      } catch (error) {
        console.error("Failed to load current user:", error)
      }
    }

    loadCurrentUser()
  }, [address, getENSByAddress, getAllRegistrations])

  // Load chat partner info
  const loadChatPartner = async (ensName: string) => {
    setIsLoading(true)
    try {
      const registrations = await getAllRegistrations()
      const partnerReg = registrations.find((r: any) => r.ensName === ensName)
      if (partnerReg) {
        setChatPartner({
          address: partnerReg.owner,
          ensName: partnerReg.ensName,
          displayName: partnerReg.displayName,
          profileImageHash: partnerReg.profileImageHash,
          isOnline: Math.random() > 0.5, // Simulate online status
          lastSeen: Date.now() - Math.random() * 3600000, // Random last seen within last hour
        })

        // Load existing messages for this chat
        loadMessages(ensName)
      }
    } catch (error) {
      console.error("Failed to load chat partner:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load messages for a specific chat
  const loadMessages = (partnerEns: string) => {
    if (!currentUser) return

    const chatKey = [currentUser.ensName, partnerEns].sort().join("-")
    const storedMessages = localStorage.getItem(`chat_${chatKey}`)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      setMessages([])
    }
  }

  // Save messages to localStorage
  const saveMessages = useCallback(
    (newMessages: Message[]) => {
      if (!currentUser || !chatPartner) return

      const chatKey = [currentUser.ensName, chatPartner.ensName].sort().join("-")
      localStorage.setItem(`chat_${chatKey}`, JSON.stringify(newMessages))
    },
    [currentUser, chatPartner],
  )

  // Send a message
  const sendMessage = async (content: string, type: "text" | "image" = "text") => {
    if (!currentUser || !chatPartner || !content.trim()) return

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.address,
      senderName: currentUser.displayName,
      senderEns: currentUser.ensName,
      recipientId: chatPartner.address,
      recipientEns: chatPartner.ensName,
      content: content.trim(),
      timestamp: Date.now(),
      type,
      status: "sending",
    }

    // Add message to local state immediately
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)

    // Simulate sending delay
    setTimeout(() => {
      const sentMessage = { ...newMessage, status: "sent" as const }
      const finalMessages = updatedMessages.map((msg) => (msg.id === newMessage.id ? sentMessage : msg))
      setMessages(finalMessages)
      saveMessages(finalMessages)

      // Simulate delivery and read status
      setTimeout(() => {
        const deliveredMessage = { ...sentMessage, status: "delivered" as const }
        const deliveredMessages = finalMessages.map((msg) => (msg.id === newMessage.id ? deliveredMessage : msg))
        setMessages(deliveredMessages)
        saveMessages(deliveredMessages)
      }, 1000)
    }, 500)

    // Simulate partner response (for demo purposes)
    if (Math.random() > 0.7) {
      setTimeout(
        () => {
          const responses = [
            "Hey there! 👋",
            "Thanks for reaching out!",
            "How's it going?",
            "Nice to meet you on Ambience!",
            "What's up?",
            "Great to connect!",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          const responseMessage: Message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            senderId: chatPartner.address,
            senderName: chatPartner.displayName,
            senderEns: chatPartner.ensName,
            recipientId: currentUser.address,
            recipientEns: currentUser.ensName,
            content: randomResponse,
            timestamp: Date.now(),
            type: "text",
            status: "sent",
          }

          const withResponse = [...updatedMessages, responseMessage]
          setMessages(withResponse)
          saveMessages(withResponse)
        },
        2000 + Math.random() * 3000,
      )
    }
  }

  // Simulate typing indicator
  const simulateTyping = () => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
  }

  return {
    messages,
    currentUser,
    chatPartner,
    isLoading,
    isTyping,
    loadChatPartner,
    sendMessage,
    simulateTyping,
  }
}
