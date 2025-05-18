import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { authUseCase } from "@/application/useCases";
import { TopRecognizedIndividuals } from "@/components/organisms/TopRecognizedIndividuals";
import { TopTeams } from "@/components/organisms/TopTeams";
import {
  TimePeriodSelector,
  ETimePeriod,
} from "@/components/molecules/TimePeriodSelector";
import {
  TimePeriod,
  AnalyticsResponseDtoData,
  TrendingWord,
} from "@/domain/models/analytics";
import { GetAnalyticsUseCase } from "@/application/useCases/analytics/GetAnalyticsUseCase";
import { AnalyticsRepositoryImpl } from "@/infrastructure/repositories/implementations/AnalyticsRepositoryImpl";
import { toastError } from "@/application/shared/utils/toast";
import { debounce } from "lodash";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingWordsPieChart } from "@/components/molecules/TrendingWordsPieChart/TrendingWordsPieChart";

interface DashboardProps {
  user: IUser | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    "weekly" as TimePeriod
  );
  const [analyticsData, setAnalyticsData] =
    useState<AnalyticsResponseDtoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the analytics use case to prevent recreation on each render
  const analyticsUseCase = useMemo(
    () => new GetAnalyticsUseCase(new AnalyticsRepositoryImpl()),
    []
  );

  // Memoize the fetch function
  const fetchData = useCallback(
    async (period: TimePeriod) => {
      setIsLoading(true);
      try {
        const data = await analyticsUseCase.execute(period);
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);

        if (
          error instanceof Error &&
          error.message.includes("session has expired")
        ) {
          toastError("Your session has expired. Please log in again.");
          onLogout();
          router.push("/login");
          return;
        }

        toastError("Failed to load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [analyticsUseCase, onLogout, router]
  );

  // Memoize the debounced function
  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 300),
    [fetchData]
  );

  useEffect(() => {
    const authStatus = authUseCase.checkAuth.execute();
    setIsAuthenticated(authStatus);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      debouncedFetchData(timePeriod);
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [timePeriod, isAuthenticated, debouncedFetchData]);

  return (
    <MainLayout user={user} onLogout={onLogout}>
      {user && isAuthenticated ? (
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            className="font-bold"
          >
            Analytics Dashboard
          </Typography>
          <hr />
          <h2 className="text-lg font-semibold my-4">User Activity Overview</h2>
          <p className="text-gray-500 mb-4">
            This dashboard provides insights about user kudos activity across
            the organization.
          </p>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
            {/* Analytics Summary Section - Tailwind version */}
            <div className="w-full flex flex-col gap-4">
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <TimePeriodSelector
                  value={
                    (timePeriod.charAt(0).toUpperCase() +
                      timePeriod.slice(1)) as ETimePeriod
                  }
                  onChange={(value) =>
                    setTimePeriod(value.toLowerCase() as TimePeriod)
                  }
                  label="Time Period"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Paper sx={{ p: 3, height: "100%", minHeight: "400px" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="font-semibold"
                    >
                      Top Recognized Individuals
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Team members who received the most kudos this {timePeriod}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                        minHeight: "300px",
                      }}
                    >
                      {isLoading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "200px",
                          }}
                        >
                          <Typography>Loading...</Typography>
                        </Box>
                      ) : analyticsData ? (
                        <>
                          <TopRecognizedIndividuals
                            data={analyticsData.topRecognizedIndividuals.map(
                              (item) => ({
                                name: item.name,
                                count: item.count,
                              })
                            )}
                            maxY={
                              timePeriod === "weekly"
                                ? 6
                                : timePeriod === "monthly"
                                ? 20
                                : 90
                            }
                          />
                          <div className="flex flex-row justify-between items-center bg-gray-100 rounded-b-lg px-3 min-h-[38px] w-full gap-1">
                            {analyticsData.topRecognizedIndividuals
                              .slice()
                              .sort((a, b) => b.count - a.count)
                              .map((person) => (
                                <div
                                  key={person.name}
                                  className="flex flex-col items-center flex-1 min-w-[60px] max-w-[80px] overflow-hidden"
                                >
                                  <span
                                    className="text-sm text-gray-600 text-center truncate max-w-[70px]"
                                    title={person.name}
                                  >
                                    {person.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : null}
                    </Box>
                  </Paper>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Paper sx={{ p: 3, height: "100%", minHeight: "400px" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="font-semibold"
                    >
                      Top Teams
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Teams with the most kudos this {timePeriod}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                        minHeight: "300px",
                      }}
                    >
                      {isLoading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "200px",
                          }}
                        >
                          <Typography>Loading...</Typography>
                        </Box>
                      ) : analyticsData ? (
                        <>
                          <TopTeams
                            data={analyticsData.topTeams.map((item) => ({
                              name: item.name,
                              count: item.count,
                            }))}
                            maxY={
                              timePeriod === "weekly"
                                ? 15
                                : timePeriod === "monthly"
                                ? 60
                                : 600
                            }
                          />
                          <div className="flex flex-row justify-between items-center bg-gray-100 rounded-b-lg px-3 min-h-[38px] w-full gap-4">
                            {analyticsData.topTeams
                              .slice()
                              .sort((a, b) => b.count - a.count)
                              .map((team) => (
                                <div
                                  key={team.name}
                                  className="flex flex-col items-center flex-1 min-w-[60px] max-w-[80px] overflow-hidden"
                                >
                                  <span
                                    className="text-sm text-gray-600 text-center truncate max-w-[70px]"
                                    title={team.name}
                                  >
                                    {team.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : null}
                    </Box>
                  </Paper>
                </Box>
              </Box>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : analyticsData ? (
                <>
                  {/* Trending Words Pie Chart */}
                  <div
                    className="bg-white rounded-xl shadow p-6 mt-6"
                    style={{ padding: 24 }}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      Trending Words
                    </h3>
                    <TrendingWordsPieChart
                      data={analyticsData?.topTrendingCategories}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Total Kudos Card */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-gray-500 text-sm mb-1">
                          Total Kudos
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {analyticsData.totalKudos}
                        </div>
                      </div>
                      {/* Example trend, replace with your real data */}
                      <div className="mt-2 text-green-600 text-sm flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        +12% from last month
                      </div>
                    </div>
                    {/* Avg Kudos per Person Card */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-gray-500 text-sm mb-1">
                          Avg. Kudos per Person
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {analyticsData.avgKudosPerPerson}
                        </div>
                      </div>
                      <div className="mt-2 text-green-600 text-sm flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                        +0.5 from last month
                      </div>
                    </div>
                    {/* Most Active Day Card */}
                    <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-gray-500 text-sm mb-1">
                          Most Active Day
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {analyticsData.mostActiveDay?.day || "N/A"}
                        </div>
                      </div>
                      <div className="mt-2 text-gray-500 text-sm">
                        {analyticsData.mostActiveDay?.percentage != null
                          ? `${analyticsData.mostActiveDay.percentage}% of all kudos sent`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "40px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 6,
              borderRadius: 2,
              background: "linear-gradient(to bottom right, #ffffff, #f5f5f5)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Analytics Dashboard
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              To access the Analytics Dashboard, you need to be logged in.
              Please log in with your account credentials to view insights about
              kudos activity.
            </Typography>

            <Link href="/login?redirectTo=/dashboard" passHref>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  boxShadow: "0 8px 16px rgba(108, 92, 231, 0.2)",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 20px rgba(108, 92, 231, 0.3)",
                  },
                }}
              >
                Log In
              </Button>
            </Link>
          </Paper>
        </Box>
      )}
    </MainLayout>
  );
};

export default Dashboard;
