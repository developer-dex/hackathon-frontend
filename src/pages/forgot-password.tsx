import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import AuthLayout from "@/components/templates/AuthLayout";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Link from "next/link";
import { toastSuccess, toastError } from "@/application/shared/utils/toast";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email address is invalid");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Here you would typically call your actual password reset API
      // For now, we'll just simulate a successful response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccess(true);
      toastSuccess("Password reset instructions sent to your email!");
    } catch (error) {
      console.error("Password reset error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to send password reset email. Please try again.");
      }

      toastError("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | KUDOS App</title>
        <meta name="description" content="Reset your KUDOS App password" />
      </Head>

      <AuthLayout title="Forgot Password">
        {success ? (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset instructions have been sent to your email.
            </Alert>
            <Typography variant="body1" paragraph>
              Please check your email inbox and follow the instructions to reset
              your password.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              If you don&apos;t receive an email within a few minutes, please
              check your spam folder.
            </Typography>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: "#6c63ff",
                borderRadius: "8px",
                textTransform: "uppercase",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#5a52d5",
                },
              }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your email address below and we&apos;ll send you
              instructions to reset your password.
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              data-testid="forgot-password-email-input"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                py: 1.5,
                backgroundColor: "#6c63ff",
                borderRadius: "8px",
                textTransform: "uppercase",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#5a52d5",
                },
              }}
              data-testid="forgot-password-submit-button"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{" "}
                <Link href="/login" passHref legacyBehavior>
                  <Typography
                    variant="body2"
                    component="a"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                  >
                    Back to Login
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;
