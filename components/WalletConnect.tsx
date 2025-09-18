"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WalletConnectProps {
  className?: string
}

export function WalletConnect({ className }: WalletConnectProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!connected) {
          return (
            <div className={className}>
              <button
                onClick={openConnectModal}
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                  'bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full',
                )}
                type="button"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            </div>
          )
        }

        if (chain.unsupported) {
          return (
            <div className={className}>
              <button
                onClick={openChainModal}
                type="button"
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                  'bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 py-2 px-4 w-full',
                )}
              >
                Wrong network
              </button>
            </div>
          )
        }

        return (
          <div className={cn('flex gap-2', className)}>
            <button
              onClick={openChainModal}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 text-sm rounded-md"
              type="button"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {chain.hasIcon && (
                <div
                  style={{
                    background: chain.iconBackground,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginRight: 4,
                  }}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                </div>
              )}
              {chain.name}
            </button>

            <button
              onClick={openAccountModal}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 text-sm rounded-md"
              type="button"
            >
              {account.displayName}
              {account.displayBalance ? ` (${account.displayBalance})` : ''}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
