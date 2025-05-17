import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";
import Link from "next/link";
import { authUseCase } from "@/application/useCases";

interface DashboardProps {
  user: IUser | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  // Add state to track authentication status on client side
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = authUseCase.checkAuth.execute();
    setIsAuthenticated(authStatus);
  }, [user]);

  return (
    <MainLayout user={user} onLogout={onLogout}>
      {user && isAuthenticated ? (
        // Show dashboard content if user is logged in
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Analytics Dashboard
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid sx={{ gridColumn: "span 12" }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  User Activity Overview
                </Typography>
                <Typography variant="body1">
                  This dashboard will provide insights about user kudos activity
                  across the organization. Currently in development.
                </Typography>
              </Paper>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Top Receivers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Team members who received the most kudos this month
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography>Data visualization coming soon</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Top Categories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Most common kudos categories being used
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography>Data visualization coming soon</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid sx={{ gridColumn: "span 12" }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Kudos Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kudos given per month over the past year
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    p: 4,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography align="center">
                    Chart will be displayed here
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Show login prompt if user is not logged in
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
