import React, { ReactNode, useEffect, useState } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";

interface IAuthLayoutProps {
  children: ReactNode;
  title: string;
}

/**
 * Layout component for authentication pages (login/signup)
 */
const AuthLayout: React.FC<IAuthLayoutProps> = ({ children, title }) => {
  // Use client-side state for dynamic content to avoid hydration mismatch
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  // Update year only on client side after initial render
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to continue
            </Typography>
          </Box>

          {children}
        </Paper>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          © {currentYear || "2023"} KUDOS App - All rights reserved
        </Typography>
      </Box>
    </Container>
  );
};

export default AuthLayout;
