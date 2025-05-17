import { IAnalyticsRepository } from "@/domain/interfaces/repositories/analytics.repository";
import { TimePeriod } from "@/domain/models/analytics";

export class GetAnalyticsUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(period: TimePeriod) {
    return this.analyticsRepository.getAnalytics(period);
  }
}
