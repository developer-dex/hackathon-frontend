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
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Link from "next/link";
import { ISignupRequest, EUserRole } from "@/domain/models/auth";
import { useTeams } from "@/application/hooks";

interface SignupFormProps {
  onSignup: (data: ISignupRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  "data-testid"?: string;
}

interface FormState extends ISignupRequest {
  confirmPassword: string;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  isLoading = false,
  error = null,
  "data-testid": testId = "signup-form",
}) => {
  const { teams, loading: loadingTeams } = useTeams();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: EUserRole.TEAM_MEMBER,
    teamId: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    teamId: "",
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      teamId: "",
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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Team validation
    if (!formData.teamId) {
      newErrors.teamId = "Team selection is required";
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? (value as EUserRole) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Pass the entire form data including confirmPassword to API
      await onSignup(formData);
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
        data-testid={`${testId}-name-input`}
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

      <TextField
        fullWidth
        margin="normal"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!formErrors.confirmPassword}
        helperText={formErrors.confirmPassword}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VerifiedUserIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
        data-testid={`${testId}-confirm-password-input`}
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
        data-testid={`${testId}-role-select`}
      >
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleSelectChange}
          startAdornment={
            <InputAdornment position="start">
              <BadgeIcon />
            </InputAdornment>
          }
          data-testid={`${testId}-role-input`}
        >
          <MenuItem value={EUserRole.TEAM_MEMBER}>
            {EUserRole.TEAM_MEMBER}
          </MenuItem>
          <MenuItem value={EUserRole.TEAM_LEAD}>{EUserRole.TEAM_LEAD}</MenuItem>
        </Select>
        {formErrors.role && (
          <Typography
            variant="caption"
            color="error"
            data-testid={`${testId}-role-error`}
          >
            {formErrors.role}
          </Typography>
        )}
      </FormControl>

      <FormControl
        fullWidth
        margin="normal"
        error={!!formErrors.teamId}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
        data-testid={`${testId}-team-select`}
      >
        <InputLabel id="team-label">Team</InputLabel>
        <Select
          labelId="team-label"
          id="teamId"
          name="teamId"
          value={formData.teamId}
          label="Team"
          onChange={handleSelectChange}
          startAdornment={
            <InputAdornment position="start">
              <GroupsIcon />
            </InputAdornment>
          }
          disabled={loadingTeams || teams.length === 0}
          data-testid={`${testId}-team-input`}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a team
          </MenuItem>
          {loadingTeams ? (
            <MenuItem disabled value="loading">
              <CircularProgress size={20} /> Loading teams...
            </MenuItem>
          ) : teams.length === 0 ? (
            <MenuItem disabled value="no-teams">
              No teams available
            </MenuItem>
          ) : (
            teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))
          )}
        </Select>
        {formErrors.teamId && (
          <Typography
            variant="caption"
            color="error"
            data-testid={`${testId}-team-error`}
          >
            {formErrors.teamId}
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
        data-testid={`${testId}-submit-button`}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
      </Button>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{" "}
          <Link href="/login" passHref legacyBehavior>
            <Typography
              variant="body2"
              component="a"
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
