export interface IPFSHook {
  uploadToIPFS: (file: File) => Promise<string>;
  getIPFSUrl: (hash: string) => string;
  isUploading: boolean;
  uploadError: string | null;
}

export interface IPFSConfig {
  gateway: string;
  apiKey?: string;
  apiSecret?: string;
}
