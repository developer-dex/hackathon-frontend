import { useState, useEffect } from "react";
import { IUser } from "@/application/useCases/kudos/getUsersUseCase";
import { kudosUseCases } from "@/application/useCases/kudos/index";

/**
 * Hook for accessing user data
 * @returns Object containing users, loading state, error state, and refresh function
 */
export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await kudosUseCases.getUsers.execute();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on initial mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
  };
};
