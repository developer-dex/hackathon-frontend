import { useState, useEffect } from "react";
import { ICategory } from "@/domain/models/kudos";
import { kudosUseCases } from "@/application/useCases/kudos/index";

/**
 * Hook for accessing category data
 * @returns Object containing categories, loading state, error state, and refresh function
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await kudosUseCases.getCategories.execute();
      setCategories(categoriesData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on initial mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  };
};
