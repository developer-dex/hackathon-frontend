import { ITeam } from "@/domain/models/team";

/**
 * Repository interface for team data
 */
export interface ITeamRepository {
  /**
   * Fetches all teams from the system
   * @returns Promise resolving to an array of teams
   */
  getAllTeams(): Promise<ITeam[]>;

  /**
   * Fetches a specific team by ID
   * @param id The unique identifier of the team
   * @returns Promise resolving to the team or null if not found
   */
  getTeamById(id: string): Promise<ITeam | null>;
}
