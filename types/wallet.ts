import { Chain } from 'wagmi';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  chain?: Chain;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

export interface WindowEthereum extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    isRainbow?: boolean;
    isCoinbaseWallet?: boolean;
    isTrust?: boolean;
    isImToken?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}
