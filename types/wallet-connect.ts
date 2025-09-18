import { ButtonHTMLAttributes } from 'react';

export interface WalletConnectProps {
  className?: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export interface WalletConnectedProps {
  address: string;
  onDisconnect: () => void;
  className?: string;
}

export interface WalletDisconnectedProps {
  onConnect: () => void;
  isConnecting: boolean;
  className?: string;
}
