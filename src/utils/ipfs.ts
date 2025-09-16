import PinataSDK from '@pinata/sdk';

const pinata = new PinataSDK({
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY,
  pinataSecretApiKey: import.meta.env.VITE_PINATA_API_SECRET,
});

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await pinata.pinFileToIPFS(formData, {
      pinataMetadata: { name: file.name },
    });
    return response.IpfsHash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}