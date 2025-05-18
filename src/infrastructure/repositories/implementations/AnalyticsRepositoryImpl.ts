import { IAnalyticsRepository } from "@/domain/interfaces/repositories/analytics.repository";
import {
  TimePeriod,
  AnalyticsResponseDto,
  AnalyticsResponseDtoData,
} from "@/domain/models/analytics";
import { LocalStorageServiceStatic } from "@/infrastructure/storage/interfaces/ILocalStorageService";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

export class AnalyticsRepositoryImpl implements IAnalyticsRepository {
  private readonly apiBaseUrl: string;

  private localStorageService: LocalStorageServiceStatic;
  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    this.localStorageService = LocalStorageService;
  }

  private getAnalyticsEndpoint(period: TimePeriod): string {
    return `${this.apiBaseUrl}/api/analytics?timePeriod=${period}`;
  }

  async getAnalytics(
    period: TimePeriod,
    token: string
  ): Promise<AnalyticsResponseDtoData> {
    try {
      // Fetch fresh data
      const response = await fetch(this.getAnalyticsEndpoint(period), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalyticsResponseDto = await response.json();

      return {
        topRecognizedIndividuals: data.data.topRecognizedIndividuals,
        topTeams: data.data.topTeams,
        totalKudos: data.data.totalKudos,
        avgKudosPerPerson: data.data.avgKudosPerPerson,
        previousPeriodComparison: data.data.previousPeriodComparison,
        mostActiveDay: data.data.mostActiveDay,
        periodStart: data.data.periodStart,
        periodEnd: data.data.periodEnd,
        topTrendingCategories: data.data.topTrendingCategories,
      };
    } catch (error) {
      console.error(
        `Error fetching analytics data for period ${period}:`,
        error
      );
      return {
        topRecognizedIndividuals: [],
        topTeams: [],
      };
    }
  }
}
