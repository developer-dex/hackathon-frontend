import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import { IUser, EUserRole } from "@/domain/models/auth";
import MainLayout from "@/components/templates/MainLayout";
import Link from "next/link";

interface HomePageProps {
  user: IUser | null;
  onLogout: () => void;
}

const HomePage: NextPage<HomePageProps> = ({ user, onLogout }) => {
  return (
    <>
      <Head>
        <title>KUDOS App - Recognize Your Team Members</title>
        <meta
          name="description"
          content="A platform to recognize and appreciate your team members' contributions and achievements."
        />
      </Head>

      <MainLayout user={user} onLogout={onLogout}>
        {user ? <AuthenticatedContent user={user} /> : <WelcomeContent />}
      </MainLayout>
    </>
  );
};

interface AuthenticatedContentProps {
  user: IUser;
}

const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({
  user,
}) => {
  const isTechLead = user.role === EUserRole.TECH_LEAD;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid
          sx={{
            gridColumn: {
              xs: "span 12",
              md: isTechLead ? "span 6" : "span 12",
            },
          }}
        >
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              View Kudos
            </Typography>
            <Typography variant="body1" paragraph>
              Browse and filter kudos given to team members across the
              organization.
            </Typography>
            <Link href="/kudos" passHref>
              <Button variant="contained" color="primary">
                View Kudos Wall
              </Button>
            </Link>
          </Paper>
        </Grid>

        {isTechLead && (
          <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
            <Paper sx={{ p: 3, height: "100%", backgroundColor: "#f0f8ff" }}>
              <Typography variant="h6" gutterBottom>
                Give Kudos
              </Typography>
              <Typography variant="body1" paragraph>
                Recognize someone&apos;s hard work and achievements by giving
                them kudos.
              </Typography>
              <Link href="/kudos/new" passHref>
                <Button variant="contained" color="secondary">
                  Create New Kudos
                </Button>
              </Link>
            </Paper>
          </Grid>
        )}

        <Grid sx={{ gridColumn: "span 12" }}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              View insights about kudos activity across the organization.
            </Typography>
            <Link href="/analytics" passHref>
              <Button variant="outlined" color="primary">
                View Analytics
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const WelcomeContent: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(135deg, #6C5CE7 0%, #D94AE6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Welcome to KUDOS App
      </Typography>

      <Typography
        variant="h6"
        paragraph
        sx={{ maxWidth: "800px", mx: "auto", mb: 4 }}
      >
        Recognize and appreciate your team members&apos; contributions and
        achievements
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 6 }}>
        <Link href="/login" passHref>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Login
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Sign Up
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
          <Paper sx={{ p: 4, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Recognize Excellence
            </Typography>
            <Typography>
              Celebrate achievements and hard work with personalized kudos that
              boost morale and motivation.
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
          <Paper sx={{ p: 4, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Build Positive Culture
            </Typography>
            <Typography>
              Foster a culture of appreciation where team members feel valued
              and recognized for their contributions.
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
          <Paper sx={{ p: 4, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Gain Insights
            </Typography>
            <Typography>
              Access analytics to understand recognition patterns and celebrate
              your most appreciated team members.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
