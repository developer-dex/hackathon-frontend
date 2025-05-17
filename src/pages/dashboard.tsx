import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";

interface DashboardProps {
  user: IUser | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <MainLayout user={user} onLogout={onLogout}>
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
    </MainLayout>
  );
};

export default Dashboard;
