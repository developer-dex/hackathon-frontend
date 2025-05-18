import { IAnalyticsRepository } from "@/domain/interfaces/repositories/analytics.repository";
import { TimePeriod } from "@/domain/models/analytics";
import { LocalStorageServiceStatic } from "@/infrastructure/storage/interfaces/ILocalStorageService";

export class GetAnalyticsUseCase {
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly localStorageService: LocalStorageServiceStatic
  ) {}

  async execute(period: TimePeriod) {
    const token = this.localStorageService.getAuthToken();
    if (!token) {
      throw new Error("No token found");
    }
    return this.analyticsRepository.getAnalytics(period, token);
  }
}
