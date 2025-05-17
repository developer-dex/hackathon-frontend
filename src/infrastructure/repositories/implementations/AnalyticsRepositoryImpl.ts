import { IAnalyticsRepository } from "@/domain/interfaces/repositories/analytics.repository";
import {
  TimePeriod,
  AnalyticsResponseDto,
  AnalyticsResponseDtoData,
} from "@/domain/models/analytics";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

export class AnalyticsRepositoryImpl implements IAnalyticsRepository {
  private readonly apiBaseUrl: string;
  private analyticsCache: Map<TimePeriod, AnalyticsResponseDto> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private lastFetchTime: Map<TimePeriod, number> = new Map();

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  private getAnalyticsEndpoint(period: TimePeriod): string {
    return `${this.apiBaseUrl}/api/analytics?timePeriod=${period}`;
  }

  private isCacheValid(period: TimePeriod): boolean {
    const lastFetch = this.lastFetchTime.get(period);
    if (!lastFetch) return false;

    const now = Date.now();
    return now - lastFetch < this.CACHE_TTL;
  }

  private updateCache(period: TimePeriod, data: AnalyticsResponseDto): void {
    this.analyticsCache.set(period, data);
    this.lastFetchTime.set(period, Date.now());
  }

  private clearCache(period: TimePeriod): void {
    this.analyticsCache.delete(period);
    this.lastFetchTime.delete(period);
  }

  async getAnalytics(period: TimePeriod): Promise<AnalyticsResponseDtoData> {
    try {
      // Clear expired cache
      this.clearCache(period);

      const token = LocalStorageService.getAuthToken();
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

      // Update cache
      this.updateCache(period, data);

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
