import React from 'react';
import ReactDOM from 'react-dom/client';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
  [sepolia],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'ENS Landing Page',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);