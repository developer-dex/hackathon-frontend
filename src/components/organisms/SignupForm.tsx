import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import Link from "next/link";
import { ISignupRequest, EUserRole } from "@/domain/models/auth";

interface SignupFormProps {
  onSignup: (data: ISignupRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<ISignupRequest>({
    name: "",
    email: "",
    password: "",
    role: EUserRole.TEAM_MEMBER,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      role: "",
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as EUserRole,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSignup(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        id="name"
        name="name"
        label="Full Name"
        type="text"
        variant="outlined"
        value={formData.name}
        onChange={handleChange}
        error={!!formErrors.name}
        helperText={formErrors.name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />

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
      />

      <FormControl
        fullWidth
        margin="normal"
        error={!!formErrors.role}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      >
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          value={formData.role}
          label="Role"
          onChange={handleSelectChange}
          startAdornment={
            <InputAdornment position="start">
              <BadgeIcon />
            </InputAdornment>
          }
        >
          <MenuItem value={EUserRole.TEAM_MEMBER}>Team Member</MenuItem>
          <MenuItem value={EUserRole.TECH_LEAD}>Tech Lead</MenuItem>
        </Select>
        {formErrors.role && (
          <Typography variant="caption" color="error">
            {formErrors.role}
          </Typography>
        )}
      </FormControl>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoading}
        sx={{
          py: 1.5,
          backgroundColor: "#4CAF50",
          borderRadius: "8px",
          textTransform: "uppercase",
          fontSize: "1rem",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#388E3C",
          },
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
      </Button>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{" "}
          <Link href="/login" passHref>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                "&:hover": {
                  textDecoration: "underline",
                },
                cursor: "pointer",
              }}
            >
              Login →
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupForm;
