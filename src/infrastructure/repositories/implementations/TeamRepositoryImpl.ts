import { ITeam, ITeamApiResponse } from "@/domain/models/team";
import { ITeamRepository } from "@/domain/interfaces/repositories/team.repository";
import { CMockTeams } from "@/domain/constants/mockTeams";

/**
 * Implementation of the team repository interface
 */
export class TeamRepositoryImpl implements ITeamRepository {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = "") {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Fetches all teams from the API or uses mock data if fetch fails
   */
  async getAllTeams(): Promise<ITeam[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/teams`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = (await response.json()) as ITeamApiResponse;

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from teams API");
      }

      return data.data;
    } catch (error) {
      console.warn("Using mock team data due to API error:", error);
      return CMockTeams;
    }
  }

  /**
   * Fetches a specific team by ID
   */
  async getTeamById(id: string): Promise<ITeam | null> {
    try {
      const teams = await this.getAllTeams();
      return teams.find((team) => team.id === id) || null;
    } catch (error) {
      console.error("Error fetching team by ID:", error);
      return null;
    }
  }
}
