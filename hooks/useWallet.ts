"use client"

import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { WalletState } from "@/types/wallet"

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const connectWallet = async (): Promise<void> => {
    // No-op as the connection is handled by RainbowKit's ConnectButton
  }

  const disconnectWallet = (): void => {
    disconnect()
  }

  const switchNetwork = async (chainId: number): Promise<void> => {
    try {
      await switchChain({ chainId })
    } catch (error) {
      console.error('Failed to switch network:', error)
      throw error
    }
  }

  return {
    address: address || null,
    isConnected,
    isConnecting: false, // Let RainbowKit handle the loading state
    chainId: chainId || null,
    chain,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } as WalletState
}
