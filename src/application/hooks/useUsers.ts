import { useState, useEffect } from "react";
import {
  IUser,
  IPaginationParams,
  IPaginatedUsers,
} from "@/application/useCases/kudos/getUsersUseCase";
import { kudosUseCases } from "@/application/useCases/kudos/index";

/**
 * Hook for accessing user data with pagination
 * @returns Object containing users, loading state, error state, pagination details and functions
 */
export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    limit: 10,
  });

  const fetchUsers = async (paginationParams?: IPaginationParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: IPaginatedUsers = await kudosUseCases.getUsers.execute(
        paginationParams
      );

      setUsers(response.users);
      setPagination({
        total: response.total,
        offset: response.offset,
        limit: response.limit,
      });
    } catch (err) {
      console.error("Error in useUsers hook:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on initial mount
  useEffect(() => {
    fetchUsers({ offset: 0, limit: 10 });
  }, []);

  // Function to change page
  const changePage = (pageIndex: number) => {
    // pageIndex is 0-based index of the page
    const newOffset = pageIndex * pagination.limit;
    fetchUsers({ offset: newOffset, limit: pagination.limit });
  };

  // Function to change items per page
  const changeItemsPerPage = (newLimit: number) => {
    fetchUsers({ offset: 0, limit: newLimit });
  };

  // Helper function to calculate current page
  const getCurrentPage = () => {
    return Math.floor(pagination.offset / pagination.limit);
  };

  // Helper function to check if there's a next page
  const hasNextPage = () => {
    return pagination.offset + pagination.limit < pagination.total;
  };

  // Helper function to check if there's a previous page
  const hasPreviousPage = () => {
    return pagination.offset > 0;
  };

  return {
    users,
    loading,
    error,
    pagination,
    refresh: fetchUsers,
    changePage,
    changeItemsPerPage,
    getCurrentPage,
    hasNextPage,
    hasPreviousPage,
  };
};
