export interface User {
  id: string
  address: string
  ensName: string
  displayName: string
  profileImage: string
  isOnline: boolean
  lastSeen: Date
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderEns: string
  content: string
  timestamp: Date
  type: "text" | "image"
}

export interface ChatRoom {
  id: string
  name: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
}

export interface ENSRegistration {
  name: string
  address: string
  profileImage: string
  displayName: string
  timestamp: Date
}
