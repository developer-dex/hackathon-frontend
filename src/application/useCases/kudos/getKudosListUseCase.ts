import { IKudos } from "@/domain/entities/Kudos.types";
import { IKudosRepository } from "@/infrastructure/repositories/interfaces/repositories/kudos.interface";

export class GetKudosListUseCase {
  constructor(private kudosRepository: IKudosRepository) {}

  /**
   * Executes the use case to fetch a list of kudos
   * @param offset Page number (0-based) for pagination
   * @param limit Number of items per page
   * @returns A promise that resolves to an array of kudos and pagination information
   */
  async execute(
    offset: number = 0,
    limit: number = 9
  ): Promise<{
    kudosList: IKudos[];
    totalCount: number;
    offset: number;
    limit: number;
    error?: string;
  }> {
    try {
      // Call repository with the page number (offset)
      const response = await this.kudosRepository.getKudosList(offset, limit);

      if (!response) {
        console.error("Failed to fetch kudos list");
        return {
          kudosList: [],
          totalCount: 0,
          offset,
          limit,
          error: "Failed to fetch kudos list",
        };
      }

      // Map API responses to match the existing KudosWall component format
      const kudosListWithBackwardCompatibility = response.data.map((kudos) => ({
        ...kudos,
        // Adding backward compatibility fields for the existing components
        recipientName: kudos.receiver.name,
        recipientTeam: kudos.team?.name || "",
        // Using a placeholder avatar URL since we don't have one in the API response
        recipientAvatarUrl: `https://i.pravatar.cc/150?u=${kudos.receiver.id}`,
        senderName: kudos.sender.name,
        senderAvatarUrl: `https://i.pravatar.cc/150?u=${kudos.sender.id}`,
        date: new Date(kudos.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));

      return {
        kudosList: kudosListWithBackwardCompatibility,
        totalCount: response.pagination.total,
        offset: response.pagination.offset,
        limit: response.pagination.limit,
      };
    } catch (error) {
      console.error("Get kudos list use case error:", error);
      return {
        kudosList: [],
        totalCount: 0,
        offset,
        limit,
        error: "An unexpected error occurred while fetching kudos",
      };
    }
  }
}
