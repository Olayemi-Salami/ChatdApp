import React from 'react';
import ReactDOM from 'react-dom/client';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import { http } from 'wagmi';

const config = getDefaultConfig({
  appName: 'ENS Landing Page',
  projectId: '0xB6F2Bd41cA5BaDC0a8e1Ed5Dd5dD44BC99fe11B0',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);