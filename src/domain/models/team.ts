/**
 * Represents a team entity in the system
 */
export interface ITeam {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response for team data
 */
export interface ITeamApiResponse {
  success: boolean;
  data: ITeam[];
  message: string;
}
