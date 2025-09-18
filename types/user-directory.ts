export interface User {
  ensName: string;
  displayName: string;
  profileImageHash: string;
  owner: string;
  registrationTime: number;
  isActive: boolean;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface UserDirectoryProps {
  onBack: () => void;
  onStartChat: (ensName: string) => void;
}

export type UserFilter = 'all' | 'online' | 'recent';

export interface UserFilterProps {
  activeFilter: UserFilter;
  onFilterChange: (filter: UserFilter) => void;
}

export interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export interface UserListProps {
  users: User[];
  currentUserAddress?: string | null;
  onStartChat: (ensName: string) => void;
  isLoading: boolean;
}
