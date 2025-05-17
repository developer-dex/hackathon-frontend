import { IKudos, IKudosApiResponse } from "@/domain/entities/Kudos.types";

export interface IKudosRepository {
  /**
   * Fetches a list of kudos
   * @param offset Pagination offset
   * @param limit Pagination limit
   * @returns A promise that resolves to an array of kudos or null if the request fails
   */
  getKudosList(
    offset?: number,
    limit?: number
  ): Promise<IKudosApiResponse | null>;

  /**
   * Fetches a single kudos by its ID
   * @param id The ID of the kudos to fetch
   * @returns A promise that resolves to a kudos object or null if not found
   */
  getKudosById(id: string): Promise<IKudos | null>;
}
