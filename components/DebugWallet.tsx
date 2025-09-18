"use client"

import { useWallet } from "@/hooks/useWallet"

export function DebugWallet() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    chainId, 
    chain,
    connectWallet,
    disconnectWallet,
    switchNetwork
  } = useWallet()

  // Only show when not connected or when connecting
  if (!isConnected || isConnecting) {
    return (
      <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg shadow-lg border border-border z-50">
        <h3 className="font-bold mb-2">Wallet Debug ({isConnecting ? 'Connecting...' : 'Not Connected'})</h3>
        <p>Click the Connect Wallet button in the header</p>
      </div>
    )
  }

  // Don't render anything when connected
  return null
}
