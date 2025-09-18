"use client"

import { useState, useCallback } from "react"
import { IPFSHook } from "@/types/ipfs"

// IPFS configuration
const IPFS_GATEWAY = "https://ipfs.io/ipfs/"

export function useIPFS(): IPFSHook {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadToIPFS = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true)
    setUploadError(null)

    try {
      // For demo purposes, we'll simulate IPFS upload and return a mock hash
      // In production, you would use a server-side API route to handle IPFS uploads
      // with proper API key management

      console.log("Uploading file to IPFS:", file.name)

      // Simulate upload time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a mock IPFS hash based on file properties
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      // Store file data in localStorage for demo (in production, this would be on IPFS)
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = e.target?.result as string
        localStorage.setItem(`ipfs_${mockHash}`, fileData)
      }
      reader.readAsDataURL(file)

      return mockHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload to IPFS"
      setUploadError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const getIPFSUrl = useCallback((hash: string): string => {
    // For demo purposes, return the stored data URL
    const storedData = localStorage.getItem(`ipfs_${hash}`)
    if (storedData) {
      return storedData
    }

    // Fallback to IPFS gateway
    return `${IPFS_GATEWAY}${hash}`
  }, [])

  const uploadJSONToIPFS = useCallback(async (data: object): Promise<string> => {
    setIsUploading(true)
    setUploadError(null)

    try {
      // For demo purposes, we'll simulate IPFS upload and return a mock hash
      console.log("Uploading JSON to IPFS")

      // Simulate upload time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a mock IPFS hash
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      // Store JSON data in localStorage for demo
      localStorage.setItem(`ipfs_${mockHash}`, JSON.stringify(data))

      return mockHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload JSON to IPFS"
      setUploadError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }, [])

  return {
    uploadToIPFS,
    getIPFSUrl,
    isUploading,
    uploadError,
  } as const
}
