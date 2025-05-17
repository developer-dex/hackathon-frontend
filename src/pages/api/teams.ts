import type { NextApiRequest, NextApiResponse } from "next";
import { ITeamApiResponse } from "@/domain/models/team";
import { teamUseCase } from "@/application/useCases/team";

/**
 * API endpoint to fetch teams from the external API
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITeamApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      data: [],
      message: "Method not allowed",
    });
  }

  try {
    // Use the team use case to fetch teams
    const teams = await teamUseCase.getTeams.execute();

    return res.status(200).json({
      success: true,
      data: teams,
      message: `Retrieved ${teams.length} teams successfully`,
    });
  } catch (error) {
    console.error("Error in teams API handler:", error);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Failed to fetch teams",
    });
  }
}
