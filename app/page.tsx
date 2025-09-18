"use client"

import { useState } from "react"
import { Landing } from "@/components/Landing"
import { Registration } from "@/components/Registration"
import { UserDirectory } from "@/components/UserDirectory"
import { Chat } from "@/components/Chat"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "register" | "directory" | "chat">("landing")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const handleGetStarted = () => {
    setCurrentView("register")
  }

  const handleBackToLanding = () => {
    setCurrentView("landing")
  }

  const handleRegistrationSuccess = () => {
    setCurrentView("directory")
  }

  const handleBackToDirectory = () => {
    setCurrentView("directory")
  }

  const handleStartChat = (ensName: string) => {
    setSelectedUser(ensName)
    setCurrentView("chat")
  }

  return (
    <main>
      {currentView === "landing" && <Landing onGetStarted={handleGetStarted} />}
      {currentView === "register" && (
        <Registration onBack={handleBackToLanding} onSuccess={handleRegistrationSuccess} />
      )}
      {currentView === "directory" && <UserDirectory onBack={handleBackToLanding} onStartChat={handleStartChat} />}
      {currentView === "chat" && selectedUser && <Chat partnerEnsName={selectedUser} onBack={handleBackToDirectory} />}
    </main>
  )
}
