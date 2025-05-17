import { ITeam } from "@/domain/models/team";
import { ITeamRepository } from "@/domain/interfaces/repositories/team.repository";

/**
 * Use case for retrieving teams
 */
export class GetTeamsUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  /**
   * Execute the use case to get all teams
   */
  async execute(): Promise<ITeam[]> {
    try {
      return await this.teamRepository.getAllTeams();
    } catch (error) {
      console.error("Error in GetTeamsUseCase:", error);
      return [];
    }
  }
}
