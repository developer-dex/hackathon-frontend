import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { IUser } from "@/domain/models/auth";
import MainLayout from "@/components/templates/MainLayout";
import Link from "next/link";
import { KudosWall } from "../components/organisms/KudosWall";
import { useKudos } from "@/application/hooks/useKudos";

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
  const { kudosList, isLoading, error, loadMore, hasMore } = useKudos();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user.name}!
      </Typography>

      {/* Kudos Wall displayed directly on the homepage */}
      <Box sx={{ mt: 4 }}>
        {isLoading && kudosList.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{ p: 2, bgcolor: "#FFF4F4", borderRadius: 1, color: "#D32F2F" }}
          >
            <Typography>{error}</Typography>
          </Box>
        ) : (
          <KudosWall
            kudosList={kudosList}
            title="Recognition Wall"
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        )}
      </Box>
    </Box>
  );
};

const WelcomeContent: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
        position: "relative",
        backgroundImage: "url('/images/kudos-pattern.svg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Hero Section with Improved Typography and Styling */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          pt: 4,
          pb: 8,
        }}
      >
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
            fontSize: { xs: "2.2rem", md: "3rem" },
          }}
        >
          Welcome to KUDOS App
        </Typography>

        <Typography
          variant="h6"
          paragraph
          sx={{ maxWidth: "800px", mx: "auto", mb: 4, color: "text.secondary" }}
        >
          Recognize and appreciate your team members&apos; contributions with
          meaningful kudos
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 6 }}>
          <Link href="/dashboard" passHref>
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
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Feature Cards with Enhanced Design */}
      <Grid
        container
        spacing={4}
        sx={{
          mt: 2,
          mb: 8,
          px: { xs: 2, md: 6 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          justifyContent: "space-between",
        }}
      >
        <Grid
          sx={{
            flex: { xs: "0 0 100%", md: "0 0 calc(33.333% - 32px)" },
            mb: { xs: 4, md: 0 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: "100%",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(108, 92, 231, 0.1)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              overflow: "hidden",
              position: "relative",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 35px rgba(108, 92, 231, 0.15)",
                "&::before": {
                  transform: "translateY(0)",
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "5px",
                background: "linear-gradient(90deg, #6C5CE7 0%, #D94AE6 100%)",
                transform: "translateY(-100%)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <Box
              sx={{
                mb: 3,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(217, 74, 230, 0.05) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                boxShadow: "0 8px 20px rgba(108, 92, 231, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#6C5CE7",
                  fontWeight: "bold",
                }}
              >
                ★
              </Typography>
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "#6C5CE7",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Recognize Excellence
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Celebrate achievements and hard work with personalized kudos that
              boost morale and motivation across your organization.
            </Typography>
          </Paper>
        </Grid>
        <Grid
          sx={{
            flex: { xs: "0 0 100%", md: "0 0 calc(33.333% - 32px)" },
            mb: { xs: 4, md: 0 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: "100%",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(108, 92, 231, 0.1)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              overflow: "hidden",
              position: "relative",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 35px rgba(108, 92, 231, 0.15)",
                "&::before": {
                  transform: "translateY(0)",
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "5px",
                background: "linear-gradient(90deg, #D94AE6 0%, #6C5CE7 100%)",
                transform: "translateY(-100%)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <Box
              sx={{
                mb: 3,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(217, 74, 230, 0.1) 0%, rgba(108, 92, 231, 0.05) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                boxShadow: "0 8px 20px rgba(217, 74, 230, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#D94AE6",
                  fontWeight: "bold",
                }}
              >
                ♥
              </Typography>
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "#D94AE6",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Build Positive Culture
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Foster a culture of appreciation where team members feel valued
              and recognized for their contributions to team success.
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ flex: { xs: "0 0 100%", md: "0 0 calc(33.333% - 32px)" } }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: "100%",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(108, 92, 231, 0.1)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              overflow: "hidden",
              position: "relative",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 15px 35px rgba(108, 92, 231, 0.15)",
                "&::before": {
                  transform: "translateY(0)",
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "5px",
                background: "linear-gradient(90deg, #6C5CE7 0%, #D94AE6 100%)",
                transform: "translateY(-100%)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <Box
              sx={{
                mb: 3,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(217, 74, 230, 0.05) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                boxShadow: "0 8px 20px rgba(108, 92, 231, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#6C5CE7",
                  fontWeight: "bold",
                }}
              >
                📊
              </Typography>
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "#6C5CE7",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Gain Insights
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Access detailed analytics on recognition patterns and trends to
              better understand and enhance your team&apos;s performance.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* How It Works Section with Improved Design */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mt: 6,
          mb: 4,
          maxWidth: "1000px",
          mx: "auto",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(108, 92, 231, 0.1)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at top right, rgba(217, 74, 230, 0.05), transparent 60%), radial-gradient(circle at bottom left, rgba(108, 92, 231, 0.05), transparent 60%)",
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 4,
              background: "linear-gradient(135deg, #6C5CE7 0%, #D94AE6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            How KUDOS Works
          </Typography>

          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
            <Grid
              sx={{
                flex: { xs: "0 0 100%", sm: "0 0 calc(33.333% - 32px)" },
                mb: { xs: 4, sm: 0 },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  py: 3,
                  px: 4,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 8px 20px rgba(108, 92, 231, 0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(108, 92, 231, 0.1)",
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "primary.light",
                    fontWeight: "bold",
                    opacity: 0.4,
                    fontSize: "4rem",
                    mb: 1,
                  }}
                >
                  1
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Sign In
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create an account or log in to get started with the KUDOS
                  platform.
                </Typography>
              </Box>
            </Grid>

            <Grid
              sx={{
                flex: { xs: "0 0 100%", sm: "0 0 calc(33.333% - 32px)" },
                mb: { xs: 4, sm: 0 },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  py: 3,
                  px: 4,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 8px 20px rgba(108, 92, 231, 0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(108, 92, 231, 0.1)",
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "primary.light",
                    fontWeight: "bold",
                    opacity: 0.4,
                    fontSize: "4rem",
                    mb: 1,
                  }}
                >
                  2
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Create Kudos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Recognize team members with personalized kudos for their
                  achievements.
                </Typography>
              </Box>
            </Grid>

            <Grid
              sx={{ flex: { xs: "0 0 100%", sm: "0 0 calc(33.333% - 32px)" } }}
            >
              <Box
                sx={{
                  mb: 2,
                  py: 3,
                  px: 4,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 8px 20px rgba(108, 92, 231, 0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(108, 92, 231, 0.1)",
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "primary.light",
                    fontWeight: "bold",
                    opacity: 0.4,
                    fontSize: "4rem",
                    mb: 1,
                  }}
                >
                  3
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Celebrate Success
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Build a culture of recognition where everyone&apos;s
                  contributions are valued.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 5 }}>
            <Link href="/signup" passHref>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(90deg, #6C5CE7 0%, #D94AE6 100%)",
                  boxShadow: "0 8px 16px rgba(108, 92, 231, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #6C5CE7 0%, #D94AE6 100%)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 20px rgba(108, 92, 231, 0.3)",
                  },
                }}
              >
                Sign Up Now →
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;
