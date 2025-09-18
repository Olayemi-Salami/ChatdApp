"use client"

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@/hooks/useChat"
import { useIPFS } from "@/hooks/useIPFS"
import { ArrowLeft, Send, User, MoreVertical, Phone, Video, Smile } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ChatProps } from "@/types/chat-component"

export function Chat({ partnerEnsName, onBack }: ChatProps) {
  const { messages, currentUser, chatPartner, isLoading, isTyping, loadChatPartner, sendMessage } = useChat()
  const { getIPFSUrl } = useIPFS()

  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat partner on mount
  useEffect(() => {
    loadChatPartner(partnerEnsName)
  }, [partnerEnsName, loadChatPartner])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!messageInput.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(messageInput)
      setMessageInput("")
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!chatPartner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const partnerImageUrl = chatPartner.profileImageHash ? getIPFSUrl(chatPartner.profileImageHash) : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Chat Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                    {partnerImageUrl ? (
                      <img
                        src={partnerImageUrl || "/placeholder.svg"}
                        alt={`${chatPartner.displayName}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  {chatPartner.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div>
                  <h1 className="font-semibold text-foreground">{chatPartner.displayName}</h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-primary">{chatPartner.ensName}.premium</p>
                    {chatPartner.isOnline ? (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Online
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Last seen {formatLastSeen(chatPartner.lastSeen)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Start the conversation</h3>
              <p className="text-muted-foreground">
                Send a message to {chatPartner.displayName} to begin your chat on Premium.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUser?.address
              const senderImageUrl = isOwnMessage
                ? currentUser?.profileImageHash
                  ? getIPFSUrl(currentUser.profileImageHash)
                  : null
                : partnerImageUrl

              return (
                <div key={message.id} className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center flex-shrink-0">
                    {senderImageUrl ? (
                      <img
                        src={senderImageUrl || "/placeholder.svg"}
                        alt={`${message.senderName}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwnMessage ? "items-end" : ""}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      {isOwnMessage && (
                        <span className="text-xs text-muted-foreground">
                          {message.status === "sending" && "Sending..."}
                          {message.status === "sent" && "Sent"}
                          {message.status === "delivered" && "Delivered"}
                          {message.status === "read" && "Read"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                {partnerImageUrl ? (
                  <img
                    src={partnerImageUrl || "/placeholder.svg"}
                    alt={`${chatPartner.displayName}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="sm">
              <Smile className="w-5 h-5" />
            </Button>

            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message ${chatPartner.displayName}...`}
              className="flex-1"
              disabled={isSending}
            />

            <Button
              type="submit"
              disabled={!messageInput.trim() || isSending}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}