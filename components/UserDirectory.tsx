"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCard } from "@/components/UserCard"
import { useContract } from "@/hooks/useContract"
import { useWallet } from "@/hooks/useWallet"
import { Search, Users, ArrowLeft, RefreshCw, Filter } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { 
  User, 
  UserDirectoryProps, 
  UserFilter, 
  UserFilterProps, 
  UserSearchProps, 
  UserListProps 
} from "@/types/user-directory"
import { Registration } from "@/types/contract"

export function UserDirectory({ onBack, onStartChat }: UserDirectoryProps) {
  console.log('UserDirectory rendered with props:', { onBack, onStartChat });
  const { address } = useWallet()
  const { getAllRegistrations } = useContract()

  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<UserFilter>("all")

  const loadUsers = useCallback(async () => {
    console.log('loadUsers called');
    if (!getAllRegistrations) {
      console.error('getAllRegistrations is not available');
      return;
    }
    
    setIsLoading(true)
    try {
      const registrations = await getAllRegistrations()
      const userList = registrations.map((reg: Registration) => ({
        ensName: reg.ensName,
        displayName: reg.displayName,
        profileImageHash: reg.profileImageHash,
        owner: reg.owner,
        registrationTime: reg.registrationTime,
        isActive: reg.isActive,
      }))

      setUsers(userList)
      setFilteredUsers(userList)
    } catch (error) {
      console.error("Failed to load users:", error)
      toast({
        title: "Failed to load users",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [getAllRegistrations])

  useEffect(() => {
    console.log('useEffect triggered, calling loadUsers');
    loadUsers()
  }, [loadUsers])

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Current state:', {
      users,
      filteredUsers,
      isLoading,
      searchQuery,
      filter
    });
  }, [users, filteredUsers, isLoading, searchQuery, filter]);

  const applyFilters = useCallback(() => {
    let filtered = users

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.ensName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply additional filters
    switch (filter) {
      case "online":
        // For demo purposes, randomly mark some users as online
        filtered = filtered.map((user) => ({
          ...user,
          isOnline: Math.random() > 0.7,
        }))
        break
      case "recent":
        filtered = filtered.sort((a, b) => b.registrationTime - a.registrationTime).slice(0, 10)
        break
      default:
        // Add random online status for demo
        filtered = filtered.map((user) => ({
          ...user,
          isOnline: Math.random() > 0.6,
        }))
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, filter])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, filter, users, applyFilters])

  const handleRefresh = useCallback(() => {
    loadUsers()
    toast({
      title: "Directory refreshed",
      description: "User list has been updated",
    })
  }, [loadUsers])

  const getFilteredCount = () => {
    switch (filter) {
      case "online":
        return filteredUsers.filter((user: any) => user.isOnline).length
      case "recent":
        return Math.min(filteredUsers.length, 10)
      default:
        return filteredUsers.length
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">User Directory</h1>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-card-foreground">Discover Users</CardTitle>
            <CardDescription>Find and connect with other members of the Ambience community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ENS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All
                </Button>
                <Button
                  variant={filter === "online" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("online")}
                  className={filter === "online" ? "bg-primary text-primary-foreground" : ""}
                >
                  Online
                </Button>
                <Button
                  variant={filter === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("recent")}
                  className={filter === "recent" ? "bg-primary text-primary-foreground" : ""}
                >
                  Recent
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <Badge variant="secondary" className="bg-card-foreground/10 text-card-foreground">
                {getFilteredCount()} users found
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {filteredUsers.filter((user: any) => user.isOnline).length} online
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-8 bg-muted rounded w-24 mt-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Be the first to register and start the community!"}
              </p>
              {!searchQuery && (
                <Button onClick={onBack} variant="outline">
                  Register Now
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user: any) => (
              <UserCard
                key={user.ensName}
                ensName={user.ensName}
                displayName={user.displayName}
                profileImageHash={user.profileImageHash}
                owner={user.owner}
                registrationTime={user.registrationTime}
                isOnline={user.isOnline}
                onStartChat={onStartChat}
              />
            ))}
          </div>
        )}

        {/* Current User Info */}
        {address && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Connected as</p>
                  <p className="text-xs text-muted-foreground">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
