export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderEns: string;
  recipientId: string;
  recipientEns: string;
  content: string;
  timestamp: number;
  type: "text" | "image";
  status: "sending" | "sent" | "delivered" | "read";
}

export interface ChatUser {
  address: string;
  ensName: string;
  displayName: string;
  profileImageHash: string;
  isOnline: boolean;
  lastSeen: number;
}

export type ChatView = "landing" | "register" | "directory" | "chat";
