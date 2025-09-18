"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useIPFS } from "@/hooks/useIPFS"
import { MessageCircle, User, Clock } from "lucide-react"

interface UserCardProps {
  ensName: string
  displayName: string
  profileImageHash: string
  owner: string
  registrationTime: number
  isOnline?: boolean
  onStartChat: (ensName: string) => void
}

export function UserCard({
  ensName,
  displayName,
  profileImageHash,
  owner,
  registrationTime,
  isOnline = false,
  onStartChat,
}: UserCardProps) {
  const { getIPFSUrl } = useIPFS()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const profileImageUrl = profileImageHash ? getIPFSUrl(profileImageHash) : null

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl || "/placeholder.svg"}
                  alt={`${displayName}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            {/* Online Status Indicator */}
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-card-foreground truncate">{displayName}</h3>
              {isOnline && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Online
                </Badge>
              )}
            </div>

            <p className="text-primary font-medium text-sm mb-2">{ensName}.premium</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {formatAddress(owner)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Joined {formatDate(registrationTime)}
              </span>
            </div>

            {/* Action Button */}
            <Button
              size="sm"
              onClick={() => onStartChat(ensName)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
