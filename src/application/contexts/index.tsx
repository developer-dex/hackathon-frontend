/**
 * React contexts go here.
 *
 * Example context:
 *
 * import React, { createContext, useContext, useState, ReactNode } from 'react';
 * import { User } from '@/domain/entities';
 *
 * interface UserContextType {
 *   users: User[];
 *   isLoading: boolean;
 *   error: Error | null;
 *   fetchUsers: () => Promise<void>;
 * }
 *
 * const UserContext = createContext<UserContextType | undefined>(undefined);
 *
 * export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 *   const [users, setUsers] = useState<User[]>([]);
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [error, setError] = useState<Error | null>(null);
 *
 *   const fetchUsers = async () => {
 *     // Implementation goes here
 *   };
 *
 *   return (
 *     <UserContext.Provider value={{ users, isLoading, error, fetchUsers }}>
 *       {children}
 *     </UserContext.Provider>
 *   );
 * };
 *
 * export const useUsers = () => {
 *   const context = useContext(UserContext);
 *   if (context === undefined) {
 *     console.error('useUsers must be used within a UserProvider');
 *     return {
 *       users: [],
 *       isLoading: false,
 *       error: null,
 *       fetchUsers: async () => {}
 *     };
 *   }
 *   return context;
 * };
 */
