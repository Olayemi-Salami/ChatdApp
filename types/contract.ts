export interface ENSRecord {
  owner: string;
  displayName: string;
  profileImageHash: string;
  registrationTime: number;
  isActive: boolean;
}

export interface Registration {
  ensName: string;
  displayName: string;
  profileImageHash: string;
  registrationTime: number;
  isActive: boolean;
}

export interface ContractConfig {
  address: string;
  abi: any[];
}
