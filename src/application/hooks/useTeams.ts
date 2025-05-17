import { useState, useEffect } from "react";
import { ITeam } from "@/domain/models/team";
import { teamUseCase } from "@/application/useCases/team";

/**
 * Hook for accessing team data
 * @returns Object containing teams, loading state, error state, and refresh function
 */
export const useTeams = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await teamUseCase.getTeams.execute();
      setTeams(teamsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch teams"));
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams on initial mount
  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refresh: fetchTeams,
  };
};
