"use client"

import { useState } from "react"
import { useWallet } from "./useWallet"
import { ENSRecord, Registration, ContractConfig } from "@/types/contract"

// Contract ABI for AmbienceENS
const AMBIENCE_ENS_ABI = [
  {
    inputs: [
      { internalType: "string", name: "ensName", type: "string" },
      { internalType: "string", name: "displayName", type: "string" },
      { internalType: "string", name: "profileImageHash", type: "string" },
    ],
    name: "registerENS",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "ensName", type: "string" }],
    name: "getENSRecord",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "string", name: "displayName", type: "string" },
      { internalType: "string", name: "profileImageHash", type: "string" },
      { internalType: "uint256", name: "registrationTime", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllENSNames",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "ensName", type: "string" }],
    name: "isENSAvailable",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
    name: "getENSByAddress",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "ensName", type: "string" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { internalType: "string", name: "displayName", type: "string" },
      { internalType: "string", name: "profileImageHash", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "ENSRegistered",
    type: "event",
  },
] as const

// For demo purposes - in production, this would be deployed to a testnet/mainnet
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTER_CONTRACT_ADDRESS || ''

// Log environment for debugging
console.log('Environment Variables:', {
  CONTRACT_ADDRESS,
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_URL: process.env.NEXT_PUBLIC_VERCEL_URL
})

export function useContract() {
  const { address, isConnected } = useWallet()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getContract = () => {
    try {
      console.log('getContract called with CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
      
      if (!window.ethereum || !isConnected) {
        throw new Error("Wallet not connected");
      }

      if (!CONTRACT_ADDRESS) {
        console.error('Contract address is not set');
        throw new Error('Contract address is not configured');
      }

      // In a real implementation, you would use ethers.js or web3.js
      const contractConfig: ContractConfig = {
        address: CONTRACT_ADDRESS,
        abi: AMBIENCE_ENS_ABI,
      };

      console.log('Returning contract config:', contractConfig);
      return contractConfig;
    } catch (error) {
      console.error('Error in getContract:', error);
      throw error;
    }
  }

  const registerENS = async (ensName: string, displayName: string, profileImageHash: string) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected")
      }

      // Simulate contract interaction
      console.log("Registering ENS:", { ensName, displayName, profileImageHash })

      // In a real implementation, this would interact with the smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate transaction time

      // Store in localStorage for demo purposes
      const registration = {
        ensName,
        displayName,
        profileImageHash,
        owner: address,
        registrationTime: Date.now(),
        isActive: true,
      }

      const existingRegistrations = JSON.parse(localStorage.getItem("ensRegistrations") || "[]")
      existingRegistrations.push(registration)
      localStorage.setItem("ensRegistrations", JSON.stringify(existingRegistrations))

      return registration
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register ENS"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getENSRecord = async (ensName: string): Promise<ENSRecord | null> => {
    try {
      // Simulate contract call
      const registrations = JSON.parse(localStorage.getItem("ensRegistrations") || "[]")
      const record = registrations.find((r: any) => r.ensName === ensName)

      if (!record) return null

      return {
        owner: record.owner,
        displayName: record.displayName,
        profileImageHash: record.profileImageHash,
        registrationTime: record.registrationTime,
        isActive: record.isActive,
      }
    } catch (err) {
      console.error("Failed to get ENS record:", err)
      return null
    }
  }

  const getAllENSNames = async (): Promise<string[]> => {
    try {
      const registrations = JSON.parse(localStorage.getItem("ensRegistrations") || "[]")
      return registrations.map((r: any) => r.ensName)
    } catch (err) {
      console.error("Failed to get all ENS names:", err)
      return []
    }
  }

  const isENSAvailable = async (ensName: string): Promise<boolean> => {
    try {
      const registrations = JSON.parse(localStorage.getItem("ensRegistrations") || "[]")
      return !registrations.some((r: any) => r.ensName === ensName)
    } catch (err) {
      console.error("Failed to check ENS availability:", err)
      return false
    }
  }

  const getENSByAddress = async (userAddress: string): Promise<string | null> => {
    try {
      const registrations = JSON.parse(localStorage.getItem("ensRegistrations") || "[]")
      const record = registrations.find((r: any) => r.owner.toLowerCase() === userAddress.toLowerCase())
      return record ? record.ensName : null
    } catch (err) {
      console.error("Failed to get ENS by address:", err)
      return null
    }
  }

  const getAllRegistrations = async () => {
    try {
      const registrations = JSON.parse(localStorage.getItem("ensRegistrations") || "[]")
      return registrations
    } catch (err) {
      console.error("Failed to get all registrations:", err)
      return []
    }
  }

  return {
    registerENS,
    getENSRecord,
    getAllENSNames,
    isENSAvailable,
    getENSByAddress,
    getAllRegistrations,
    registrations,
    isLoading,
    error,
    contractAddress: CONTRACT_ADDRESS,
  }
}
