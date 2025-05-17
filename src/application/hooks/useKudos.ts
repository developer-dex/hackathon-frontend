import { useCallback, useEffect, useState } from "react";
import { IKudos } from "@/domain/entities/Kudos.types";
import { kudosUseCases } from "@/application/useCases/kudos";

interface IUseKudosReturn {
  kudosList: IKudos[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  fetchKudosList: (offset?: number, limit?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  offset: number;
  limit: number;
}

/**
 * Hook for fetching and managing kudos data
 * @returns An object containing the kudos list, loading state, error state, and functions to fetch kudos
 */
export const useKudos = (): IUseKudosReturn => {
  const [kudosList, setKudosList] = useState<IKudos[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(9);

  const fetchKudosList = useCallback(
    async (newOffset?: number, newLimit?: number) => {
      setIsLoading(true);
      setError(null);

      try {
        // Update state if new values are provided
        if (newOffset !== undefined) setOffset(newOffset);
        if (newLimit !== undefined) setLimit(newLimit);

        // Use the new values for the fetch, or use existing state values
        const finalOffset = newOffset !== undefined ? newOffset : offset;
        const finalLimit = newLimit !== undefined ? newLimit : limit;

        const result = await kudosUseCases.getKudosList.execute(
          finalOffset,
          finalLimit
        );

        if (result.error) {
          setError(result.error);
          setKudosList([]);
        } else {
          setKudosList(result.kudosList);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error("Error in useKudos hook:", err);
        setError("An unexpected error occurred while fetching kudos");
        setKudosList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [offset, limit]
  );

  // Function to load more kudos (append to existing list)
  const loadMore = useCallback(async () => {
    if (isLoading || kudosList.length >= totalCount) return;

    setIsLoading(true);
    setError(null);

    try {
      // Increment page number (offset) by 1 to fetch the next page
      const nextOffset = offset + 1;

      const result = await kudosUseCases.getKudosList.execute(
        nextOffset,
        limit
      );

      if (result.error) {
        setError(result.error);
      } else {
        // Append new kudos to the existing list
        setKudosList((prevKudos) => [...prevKudos, ...result.kudosList]);
        setTotalCount(result.totalCount);
        setOffset(nextOffset);
      }
    } catch (err) {
      console.error("Error loading more kudos:", err);
      setError("An unexpected error occurred while loading more kudos");
    } finally {
      setIsLoading(false);
    }
  }, [kudosList, totalCount, offset, limit, isLoading]);

  // Calculate if there are more kudos to load
  // Add 1 to offset before multiplication since offset is 0-indexed (page 0 is first page)
  const hasMore = totalCount > (offset + 1) * limit;

  // Fetch kudos on component mount
  useEffect(() => {
    fetchKudosList();
  }, [fetchKudosList]);

  return {
    kudosList,
    isLoading,
    error,
    totalCount,
    fetchKudosList,
    loadMore,
    hasMore,
    offset,
    limit,
  };
};
