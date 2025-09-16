import React, { useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { uploadToIPFS } from '../utils/ipfs';
import RegisterABI from '../abis/Register.json';

interface RegisterENSProps {
  contractAddress: string;
}

const RegisterENS: React.FC<RegisterENSProps> = ({ contractAddress }) => {
  const [ensName, setEnsName] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: RegisterABI,
    functionName: 'registerENS',
    args: [ensName, name, ''],
  });

  const { writeAsync, isLoading } = useContractWrite(config);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      const ipfsHash = await uploadToIPFS(image);
      await writeAsync?.({ args: [ensName, name, ipfsHash] });
      setEnsName('');
      setName('');
      setImage(null);
    } catch (err) {
      setError('Failed to register ENS. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Register ENS</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">ENS Name (e.g., sogo.cohort13)</label>
          <input
            type="text"
            value={ensName}
            onChange={(e) => setEnsName(e.target.value)}
            placeholder="Olayemi"
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded w-full disabled:bg-gray-400"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterENS;