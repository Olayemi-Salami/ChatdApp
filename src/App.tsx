import React from 'react';
import ConnectWallet from './components/ConnectWallet';
import RegisterENS from './components/RegisterENS';
import ENSList from './components/ENSList';

const App: React.FC = () => {
  const contractAddress = import.meta.env.VITE_REGISTER_CONTRACT_ADDRESS || '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">ENS Registration</h1>
      <div className="flex justify-center mb-8">
        <ConnectWallet />
      </div>
      <RegisterENS contractAddress={contractAddress} />
      <h2 className="text-2xl font-bold mt-12 text-center">Registered ENS Names</h2>
      <ENSList contractAddress={contractAddress} />
    </div>
  );
};

export default App;