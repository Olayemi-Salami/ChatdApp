import { Message, ChatUser } from './chat';

export interface ChatProps {
  partnerEnsName: string;
  onBack: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  userAvatar: string;
  partnerAvatar: string;
}

export interface ChatHeaderProps {
  partner: ChatUser | null;
  onBack: () => void;
  onCall: () => void;
  onVideoCall: () => void;
}

export interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
  isSending: boolean;
}

export interface MessageListProps {
  messages: Message[];
  currentUser: ChatUser | null;
  chatPartner: ChatUser | null;
  isTyping: boolean;
  getIPFSUrl: (hash: string) => string;
}
