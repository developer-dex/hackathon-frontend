export enum TimePeriod {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

export interface RecognizedIndividual {
  id: string;
  name: string;
  count: number;
}

export interface TeamAnalytics {
  id: string;
  name: string;
  count: number;
}

export interface DayActivity {
  day: string;
  count: number;
  percentage: number;
}

export interface AnalyticsRequestDto {
  timePeriod: TimePeriod;
  teamId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface AnalyticsResponseDto {
  statusCode: number;
  message: string;
  success: boolean;
  data: AnalyticsResponseDtoData;
}

export interface AnalyticsResponseDtoData {
  topRecognizedIndividuals: RecognizedIndividual[];
  topTeams: TeamAnalytics[];
  totalKudos?: number;
  avgKudosPerPerson?: number;
  previousPeriodComparison?: {
    totalKudos?: {
      previous: number;
      percentageChange: number;
    };
    avgKudosPerPerson?: {
      previous: number;
      percentageChange: number;
    };
  };
  mostActiveDay?: DayActivity;
  periodStart?: string;
  periodEnd?: string;
}
