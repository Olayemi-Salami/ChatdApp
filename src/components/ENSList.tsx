import React from 'react';
import { useContractRead } from 'wagmi';
import RegisterABI from '../abis/Register.json';

interface User {
  name: string;
  imageIPFSHash: string;
  userAddress: string;
}

interface ENSListProps {
  contractAddress: string;
}

const ENSList: React.FC<ENSListProps> = ({ contractAddress }) => {
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: RegisterABI,
    functionName: 'getAllUsers',
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading ENS data</div>;

  const [ensNames, users] = data as [string[], User[]];

  if (!ensNames || ensNames.length === 0) return <div className="text-center">No ENS names registered</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {ensNames.map((ensName, index) => (
        <div key={ensName} className="border p-4 rounded shadow">
          <img
            src={`https://ipfs.io/ipfs/${users[index].imageIPFSHash}`}
            alt={ensName}
            className="w-24 h-24 object-cover rounded-full mx-auto"
            onError={(e) => (e.currentTarget.src = '/fallback-image.png')}
          />
          <p className="mt-2"><strong>ENS:</strong> {ensName}</p>
          <p><strong>Name:</strong> {users[index].name}</p>
          <p><strong>Address:</strong> {users[index].userAddress}</p>
        </div>
      ))}
    </div>
  );
};

export default ENSList;