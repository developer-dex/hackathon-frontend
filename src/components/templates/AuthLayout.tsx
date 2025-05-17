import React, { ReactNode, useEffect, useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

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
            position: "relative",
          }}
        >
          {/* Close button positioned at the top right of the modal */}
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1,
            }}
          >
            <Link href="/" passHref>
              <IconButton
                color="primary"
                aria-label="back to home"
                size="medium"
                sx={{
                  backgroundColor: "rgba(108, 92, 231, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(108, 92, 231, 0.2)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
              mt: 2,
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
