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
  TrendingCategory,
  DayActivity
} from "@/domain/models/analytics";
import { GetAnalyticsUseCase } from "@/application/useCases/analytics/getAnalyticsUseCase";
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
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";
import { WeeklyActivityTimeline } from "@/components/molecules/WeeklyActivityTimeline";

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
    () =>
      new GetAnalyticsUseCase(
        new AnalyticsRepositoryImpl(),
        LocalStorageService
      ),
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4, maxWidth: "100%" }}>
            {/* Analytics Summary Section - with consistent containers */}
            <div className="w-full flex flex-col gap-6">
              {/* Time Range Section */}
              <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Data Time Range</span>
                </div>
                <TimePeriodSelector
                  value={
                    (timePeriod.charAt(0).toUpperCase() +
                      timePeriod.slice(1)) as ETimePeriod
                  }
                  onChange={(value) =>
                    setTimePeriod(value.toLowerCase() as TimePeriod)
                  }
                  label=""
                />
              </div>
              
              {/* Metrics Cards Section */}
              {isLoading ? (
                <div className="flex justify-center items-center h-32 bg-white rounded-xl shadow-md">
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : analyticsData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Kudos Card */}
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">
                          Total Kudos
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mt-2">
                          {analyticsData.totalKudos}
                        </div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 text-green-600 text-sm font-medium flex items-center">
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
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">
                          Avg. Kudos per Person
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mt-2">
                          {analyticsData.avgKudosPerPerson}
                        </div>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 text-green-600 text-sm font-medium flex items-center">
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
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">
                          Most Active Day
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mt-2">
                          {analyticsData.mostActiveDay?.day || "N/A"}
                        </div>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 text-gray-600 text-sm font-medium">
                      {analyticsData.mostActiveDay?.percentage != null
                        ? `${analyticsData.mostActiveDay.percentage}% of all kudos sent`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Recognized Individuals */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-1">Top Recognized Individuals</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Team members who received the most kudos this {timePeriod}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-[300px]">
                        <span className="text-gray-400">Loading...</span>
                      </div>
                    ) : analyticsData ? (
                      <div className="flex flex-col h-full">
                        <div className="flex-grow">
                          <TopRecognizedIndividuals
                            data={analyticsData.topRecognizedIndividuals.map(
                              (item) => ({
                                name: item.name,
                                count: item.count,
                              })
                            )}
                            maxY={
                              timePeriod === "weekly"
                                ? 10
                                : timePeriod === "monthly"
                                ? 20
                                : 25
                            }
                          />
                        </div>
                        <div className="grid grid-cols-5 gap-1 mt-2 bg-gray-100 rounded-b-lg p-2">
                          {analyticsData.topRecognizedIndividuals
                            .slice(0, 5)
                            .map((person, index) => (
                              <div
                                key={person.name}
                                className="flex flex-col items-center justify-center text-center"
                              >
                                <span
                                  className="text-xs text-gray-600 truncate w-full px-1"
                                  title={person.name}
                                >
                                  {person.name.length > 10 
                                    ? `${person.name.substring(0, 8)}...` 
                                    : person.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                
                {/* Top Teams */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-1">Top Teams</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Teams with the most kudos this {timePeriod}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-[300px]">
                        <span className="text-gray-400">Loading...</span>
                      </div>
                    ) : analyticsData ? (
                      <div className="flex flex-col h-full">
                        <div className="flex-grow">
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
                                : 40
                            }
                          />
                        </div>
                        <div className="grid grid-cols-5 gap-1 mt-2 bg-gray-100 rounded-b-lg p-2">
                          {analyticsData.topTeams
                            .slice(0, 5)
                            .map((team) => (
                              <div
                                key={team.name}
                                className="flex flex-col items-center justify-center text-center"
                              >
                                <span
                                  className="text-xs text-gray-600 truncate w-full px-1"
                                  title={team.name}
                                >
                                  {team.name.length > 10 
                                    ? `${team.name.substring(0, 8)}...` 
                                    : team.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              
              {/* Additional Charts */}
              {isLoading ? (
                <div className="flex justify-center items-center h-32 bg-white rounded-xl shadow-md">
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : analyticsData ? (
                <div className="grid grid-cols-1 gap-6">
                  {/* Trending Words Pie Chart */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Trending Words
                      </h3>
                    </div>
                    <TrendingWordsPieChart
                      data={analyticsData?.topTrendingCategories}
                    />
                  </div>
                  
                  {/* Weekly Activity Timeline */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {timePeriod === 'weekly' ? 'Weekly Activity' :
                         timePeriod === 'monthly' ? 'Monthly Activity' :
                         timePeriod === 'quarterly' ? 'Quarterly Activity' :
                         timePeriod === 'yearly' ? 'Yearly Activity' : ''} 
                      </h3>
                      <div className="bg-amber-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                    </div>
                    <WeeklyActivityTimeline
                      weekStart={analyticsData.periodStart}
                      weekEnd={analyticsData.periodEnd}
                    />
                  </div>
                </div>
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
