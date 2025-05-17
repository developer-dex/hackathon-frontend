import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { authUseCase } from "@/application/useCases";
import { TopRecognizedIndividuals } from "@/components/organisms/TopRecognizedIndividuals";
import { TopTeams } from "@/components/organisms/TopTeams";
import { TimePeriodFilter } from "@/components/atoms/TimePeriodFilter";
import {
  TimePeriod,
  AnalyticsResponseDtoData,
} from "@/domain/models/analytics";
import { GetAnalyticsUseCase } from "@/application/useCases/analytics/GetAnalyticsUseCase";
import { AnalyticsRepositoryImpl } from "@/infrastructure/repositories/implementations/AnalyticsRepositoryImpl";
import { toastError } from "@/application/utils/toast";
import { debounce } from "lodash";

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

  // Memoize time period options to prevent recreation on each render
  const timePeriodOptions = useMemo(
    () => [
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "yearly", label: "Yearly" },
    ],
    []
  );

  useEffect(() => {
    const authStatus = authUseCase.checkAuth.execute();
    setIsAuthenticated(authStatus);
  }, [user]);

  // Debounced fetch function
  const debouncedFetchData = useCallback(
    debounce(async (period: TimePeriod) => {
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
    }, 300),
    [analyticsUseCase, onLogout, router, setIsLoading, setAnalyticsData]
  );

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
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Analytics Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Time Period
            </Typography>
            <TimePeriodFilter
              value={timePeriod}
              onChange={(value) => setTimePeriod(value as TimePeriod)}
              options={timePeriodOptions}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
            <Box>
              <Paper sx={{ p: 3, minHeight: "200px" }}>
                <Typography variant="h6" gutterBottom>
                  User Activity Overview
                </Typography>
                <Typography variant="body1">
                  This dashboard provides insights about user kudos activity
                  across the organization.
                </Typography>
                <Box sx={{ mt: 2, minHeight: "100px" }}>
                  {isLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100px",
                      }}
                    >
                      <Typography>Loading...</Typography>
                    </Box>
                  ) : analyticsData ? (
                    <Box>
                      <Typography variant="body2">
                        Total Kudos: {analyticsData.totalKudos}
                      </Typography>
                      <Typography variant="body2">
                        Average Kudos per Person:{" "}
                        {analyticsData.avgKudosPerPerson}
                      </Typography>
                      <Typography variant="body2">
                        Most Active Day:{" "}
                        {analyticsData.mostActiveDay?.toString() || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Period:{" "}
                        {analyticsData.periodStart
                          ? new Date(
                              analyticsData.periodStart
                            ).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {analyticsData.periodEnd
                          ? new Date(
                              analyticsData.periodEnd
                            ).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              </Paper>
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
                  <Typography variant="h6" gutterBottom>
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
                        <div className="flex flex-row justify-between items-center bg-gray-100 rounded-b-lg px-3 min-h-[38px] w-full gap-4">
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
                  <Typography variant="h6" gutterBottom>
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
