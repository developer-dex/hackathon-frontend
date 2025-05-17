import {
  TimePeriod,
  AnalyticsResponseDtoData,
} from "@/domain/models/analytics";

export interface ITopIndividual {
  name: string;
  count: number;
}

export interface ITopTeam {
  name: string;
  count: number;
}

export interface IAnalyticsRepository {
  getAnalytics(period: TimePeriod): Promise<AnalyticsResponseDtoData>;
}
