import { useCallback, useEffect, useState, useRef } from "react";
import { IKudos } from "@/domain/entities/Kudos.types";
import { kudosUseCases } from "@/application/useCases/kudos/index";
import { KudosFilterValues } from "@/components/molecules/KudosFilters";

interface IUseKudosReturn {
  kudosList: IKudos[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  fetchKudosList: (
    offset?: number,
    limit?: number,
    filters?: Partial<KudosFilterValues>
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  offset: number;
  limit: number;
  filters: Partial<KudosFilterValues>;
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
  const [filters, setFilters] = useState<Partial<KudosFilterValues>>({});
  const loadingRef = useRef<boolean>(false);

  const fetchKudosList = useCallback(
    async (
      newOffset?: number,
      newLimit?: number,
      newFilters?: Partial<KudosFilterValues>
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        // Update state if new values are provided
        if (newOffset !== undefined) setOffset(newOffset);
        if (newLimit !== undefined) setLimit(newLimit);
        if (newFilters !== undefined) {
          setFilters(newFilters);
          // When applying new filters, make sure we start with empty list to
          // avoid showing stale data from previous filters
          if (newOffset === 0) {
            setKudosList([]);
          }
        }

        // Use the new values for the fetch, or use existing state values
        const finalOffset = newOffset !== undefined ? newOffset : offset;
        const finalLimit = newLimit !== undefined ? newLimit : limit;
        const finalFilters = newFilters !== undefined ? newFilters : filters;

        // Filter out empty string values from filters
        const activeFilters: Record<string, string> = {};
        Object.entries(finalFilters).forEach(([key, value]) => {
          if (value && value !== "") {
            activeFilters[key] = value;
          }
        });

        const result = await kudosUseCases.getKudosList.execute(
          finalOffset,
          finalLimit,
          activeFilters
        );

        if (result.error) {
          setError(result.error);
          // Only clear the list if this is the first page (offset 0)
          if (finalOffset === 0) {
            setKudosList([]);
          }
        } else {
          // If this is the first page, replace the list, otherwise append
          if (finalOffset === 0) {
            setKudosList(result.kudosList);
          } else {
            // For additional pages, append to existing list
            setKudosList((currentList) => [
              ...currentList,
              ...result.kudosList,
            ]);
          }
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error("Error in useKudos hook:", err);
        setError("An unexpected error occurred while fetching kudos");
        // Only clear the list if this is the first page (offset 0)
        if (newOffset === 0 || (newOffset === undefined && offset === 0)) {
          setKudosList([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [offset, limit, filters]
  );

  // Function to load more kudos (append to existing list)
  const loadMore = useCallback(async () => {
    // Prevent duplicate calls
    if (loadingRef.current || isLoading || kudosList.length >= totalCount)
      return;

    // Set both the ref and state to prevent duplicate calls
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Store current items to ensure we can append properly
      const currentItems = [...kudosList];
      const nextOffset = offset + 1;

      // Filter out empty string values from filters
      const activeFilters: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          activeFilters[key] = value;
        }
      });

      const result = await kudosUseCases.getKudosList.execute(
        nextOffset,
        limit,
        activeFilters
      );

      if (result.error) {
        setError(result.error);
      } else {
        // Create new array with both current items and new items
        const newList = [...currentItems, ...result.kudosList];
        setKudosList(newList);
        setTotalCount(result.totalCount);
        setOffset(nextOffset);
      }
    } catch (err) {
      console.error("Error loading more kudos:", err);
      setError("An unexpected error occurred while loading more kudos");
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [kudosList, totalCount, offset, limit, isLoading, filters]);

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
    filters,
  };
};
