import { TeamRepositoryImpl } from "@/infrastructure/repositories/implementations/TeamRepositoryImpl";
import { GetTeamsUseCase } from "./getTeamsUseCase";

// Export use case classes for type usage
export type { GetTeamsUseCase };

/**
 * Team Use Case Factory
 * Responsible for creating and providing singleton instances of team use cases
 */
class TeamUseCaseFactory {
  private static _iGetTeamsUseCase: GetTeamsUseCase;
  private static _teamRepository = new TeamRepositoryImpl(
    process.env.NEXT_PUBLIC_API_URL || ""
  );

  /**
   * Get teams use case singleton instance
   */
  static get getTeams(): GetTeamsUseCase {
    if (!this._iGetTeamsUseCase) {
      this._iGetTeamsUseCase = new GetTeamsUseCase(this._teamRepository);
    }
    return this._iGetTeamsUseCase;
  }
}

// Export the team use case factory
export const teamUseCase = TeamUseCaseFactory;
