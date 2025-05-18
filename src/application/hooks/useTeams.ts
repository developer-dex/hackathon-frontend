import { useState, useEffect } from "react";
import { ITeam } from "@/domain/entities/Kudos.types";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

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

      // Get auth token from local storage
      const token = LocalStorageService.getAuthToken();

      // Create config for request with headers
      const config = {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      };

      const response = await httpClient.get<{
        success: boolean;
        data: ITeam[] | { teams?: ITeam[] };
        message: string;
      }>("/api/teams", config);

      // Handle different possible API response structures
      let teamsData: ITeam[] = [];

      if (Array.isArray(response.data.data)) {
        // If data is directly an array of teams
        teamsData = response.data.data;
      } else if (
        response.data.data &&
        "teams" in response.data.data &&
        Array.isArray(response.data.data.teams)
      ) {
        // If data contains a teams property
        teamsData = response.data.data.teams;
      } else {
        // Log error but continue with empty array
        console.error(
          "Unexpected API response format for teams:",
          response.data
        );
      }

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
