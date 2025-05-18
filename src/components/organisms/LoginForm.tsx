import React, { useState } from "react";
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
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { IAuthCredentials } from "@/domain/models/auth";

interface LoginFormProps {
  onLogin: (credentials: IAuthCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  "data-testid"?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  error = null,
  "data-testid": testId = "login-form",
}) => {
  const [formData, setFormData] = useState<IAuthCredentials>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onLogin(formData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      data-testid={testId}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} data-testid={`${testId}-error`}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        id="email"
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        value={formData.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
        data-testid={`${testId}-email-input`}
      />

      <TextField
        fullWidth
        margin="normal"
        id="password"
        name="password"
        label="Password"
        type="password"
        variant="outlined"
        value={formData.password}
        onChange={handleChange}
        error={!!formErrors.password}
        helperText={formErrors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
        data-testid={`${testId}-password-input`}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Link href="/forgot-password" passHref legacyBehavior>
          <Typography
            variant="body2"
            component="a"
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                color: "primary.main",
              },
              cursor: "pointer",
            }}
          >
            Forgot Username / Password?
          </Typography>
        </Link>
      </Box>

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
        data-testid={`${testId}-submit-button`}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{" "}
          <Link href="/signup" passHref legacyBehavior>
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
              Create your Account →
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
