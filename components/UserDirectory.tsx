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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back
              </Button>
              <div className="ml-6 flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Users className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="ml-2.5 text-lg font-semibold text-gray-900 dark:text-white">
                  User Directory
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discover Users</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Find and connect with other members of the community
          </p>
          
          {/* Stats */}
          <div className="mt-4 flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              {getFilteredCount()} users
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
              {filteredUsers.filter((user: any) => user.isOnline).length} online
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or ENS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
            </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                    filter === "all"
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("online")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filter === "online"
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("recent")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filter === "recent"
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Recent
                </button>
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
          </div>
        </div>

        {/* User Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Be the first to register and start the community!"}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user: any) => (
                <div key={user.ensName} className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {user.profileImageHash ? (
                              <img 
                                src={`https://ipfs.io/ipfs/${user.profileImageHash}`} 
                                alt={user.displayName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30">
                                <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                          </div>
                          {user.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.displayName || user.ensName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.ensName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onStartChat?.(user)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button
            type="button"
            className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Current User Info */}
        {address && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Your Wallet</p>
                  <p className="text-muted-foreground text-xs truncate max-w-[180px]">
                    {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button
          type="button"
          className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
