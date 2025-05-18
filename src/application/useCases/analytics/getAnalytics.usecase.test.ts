import { LocalStorageServiceSpy } from "@/infrastructure/storage/__tests__/LocalStorageServiceSpy";
import { GetAnalyticsUseCase } from "./getAnalyticsUseCase";
import { AnalyticsRepositoryImpl } from "@/infrastructure/repositories/implementations/AnalyticsRepositoryImpl";
import { TimePeriod } from "@/domain/models/analytics";

jest.mock(
  "@/infrastructure/repositories/implementations/AnalyticsRepositoryImpl"
);

describe("GetAnalyticsUseCase", () => {
  const analyticsRepository = new AnalyticsRepositoryImpl();
  const localStorageSpy = new LocalStorageServiceSpy();

  beforeEach(() => {
    localStorageSpy.clearAuth();
    jest.clearAllMocks();
  });

  it("should be able to get analytics", async () => {
    localStorageSpy.setAuthToken("123");
    const mockAnalytics = { data: [] };
    (analyticsRepository.getAnalytics as jest.Mock).mockResolvedValue(
      mockAnalytics
    );

    const getAnalyticsUseCase = new GetAnalyticsUseCase(
      analyticsRepository,
      localStorageSpy
    );
    const analytics = await getAnalyticsUseCase.execute(TimePeriod.MONTHLY);
    expect(analytics).toBeDefined();
    expect(analyticsRepository.getAnalytics).toHaveBeenCalledWith(
      TimePeriod.MONTHLY,
      "123"
    );
    expect(analyticsRepository.getAnalytics).toHaveBeenCalledTimes(1);
  });

  it("should not be able to get analytics if there is no auth token", async () => {
    const getAnalyticsUseCase = new GetAnalyticsUseCase(
      analyticsRepository,
      localStorageSpy
    );

    const analytics = getAnalyticsUseCase.execute(TimePeriod.MONTHLY);

    await expect(analytics).rejects.toThrow();
    expect(analyticsRepository.getAnalytics).not.toHaveBeenCalled();
  });

  it("should throw an error if the analytics repository throws an error ", async () => {
    localStorageSpy.setAuthToken("123");
    (analyticsRepository.getAnalytics as jest.Mock).mockRejectedValue(
      new Error("Error")
    );

    const getAnalyticsUseCase = new GetAnalyticsUseCase(
      analyticsRepository,
      localStorageSpy
    );

    const analytics = getAnalyticsUseCase.execute(TimePeriod.MONTHLY);

    await expect(analytics).rejects.toThrow();
    expect(analyticsRepository.getAnalytics).toHaveBeenCalledWith(
      TimePeriod.MONTHLY,
      "123"
    );
    expect(analyticsRepository.getAnalytics).toHaveBeenCalledTimes(1);
  });
});
