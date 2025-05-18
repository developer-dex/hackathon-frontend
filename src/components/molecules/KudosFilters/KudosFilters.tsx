import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  SelectChangeEvent,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import GroupsIcon from "@mui/icons-material/Groups";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import { IUser } from "@/domain/models/auth";
import { ICategory, ITeam } from "@/domain/entities/Kudos.types";

export interface KudosFiltersProps {
  onApplyFilters: (filters: KudosFilterValues) => void;
  users?: IUser[];
  categories?: Partial<ICategory>[];
  teams?: ITeam[];
  loadingUsers?: boolean;
  loadingCategories?: boolean;
  loadingTeams?: boolean;
  className?: string;
}

export interface KudosFilterValues {
  senderId: string;
  receiverId: string;
  categoryId: string;
  teamId: string;
}

export const KudosFilters: React.FC<KudosFiltersProps> = ({
  onApplyFilters,
  users = [],
  categories = [],
  teams = [],
  loadingUsers = false,
  loadingCategories = false,
  loadingTeams = false,
  className = "",
}) => {
  const [filters, setFilters] = useState<KudosFilterValues>({
    senderId: "",
    receiverId: "",
    categoryId: "",
    teamId: "",
  });

  // Check if there are any active filters
  const hasActiveFilters =
    filters.senderId !== "" ||
    filters.receiverId !== "" ||
    filters.categoryId !== "" ||
    filters.teamId !== "";

  // Count active filters
  const activeFilterCount = [
    filters.senderId,
    filters.receiverId,
    filters.categoryId,
    filters.teamId,
  ].filter((filter) => filter !== "").length;

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilter = (filterName: keyof KudosFilterValues) => {
    const updatedFilters = {
      ...filters,
      [filterName]: "",
    };
    setFilters(updatedFilters);
    // Apply the updated filters immediately
    onApplyFilters(updatedFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      senderId: "",
      receiverId: "",
      categoryId: "",
      teamId: "",
    };
    setFilters(emptyFilters);
    // Also apply the empty filters immediately to reset the list
    onApplyFilters(emptyFilters);
  };

  return (
    <Box
      className={className}
      sx={{
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        padding: 3,
        mb: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          <FilterAltIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Filter Kudos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use these filters to find specific recognition
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Sender Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="sender-label">Sender</InputLabel>
            <Select
              labelId="sender-label"
              id="senderId"
              name="senderId"
              value={filters.senderId}
              label="Sender"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon
                    fontSize="small"
                    color={filters.senderId ? "primary" : "inherit"}
                  />
                </InputAdornment>
              }
              disabled={loadingUsers}
              sx={{
                ...(filters.senderId && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  transition: "all 0.3s ease",
                  animation: "pulse 0.5s",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(108, 92, 231, 0)",
                    },
                    "50%": {
                      boxShadow: "0 0 0 5px rgba(108, 92, 231, 0.1)",
                    },
                  },
                }),
              }}
            >
              <MenuItem value="">All Senders</MenuItem>
              {loadingUsers ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                </MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Receiver Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="receiver-label">Receiver</InputLabel>
            <Select
              labelId="receiver-label"
              id="receiverId"
              name="receiverId"
              value={filters.receiverId}
              label="Receiver"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon
                    fontSize="small"
                    color={filters.receiverId ? "primary" : "inherit"}
                  />
                </InputAdornment>
              }
              disabled={loadingUsers}
              sx={{
                ...(filters.receiverId && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  transition: "all 0.3s ease",
                  animation: "pulse 0.5s",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(108, 92, 231, 0)",
                    },
                    "50%": {
                      boxShadow: "0 0 0 5px rgba(108, 92, 231, 0.1)",
                    },
                  },
                }),
              }}
            >
              <MenuItem value="">All Receivers</MenuItem>
              {loadingUsers ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                </MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="categoryId"
              name="categoryId"
              value={filters.categoryId}
              label="Category"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon
                    fontSize="small"
                    color={filters.categoryId ? "primary" : "inherit"}
                  />
                </InputAdornment>
              }
              disabled={loadingCategories}
              sx={{
                ...(filters.categoryId && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  transition: "all 0.3s ease",
                  animation: "pulse 0.5s",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(108, 92, 231, 0)",
                    },
                    "50%": {
                      boxShadow: "0 0 0 5px rgba(108, 92, 231, 0.1)",
                    },
                  },
                }),
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {loadingCategories ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                </MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Team Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="team-label">Team</InputLabel>
            <Select
              labelId="team-label"
              id="teamId"
              name="teamId"
              value={filters.teamId}
              label="Team"
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <GroupsIcon
                    fontSize="small"
                    color={filters.teamId ? "primary" : "inherit"}
                  />
                </InputAdornment>
              }
              disabled={loadingTeams}
              sx={{
                ...(filters.teamId && {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  transition: "all 0.3s ease",
                  animation: "pulse 0.5s",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(108, 92, 231, 0)",
                    },
                    "50%": {
                      boxShadow: "0 0 0 5px rgba(108, 92, 231, 0.1)",
                    },
                  },
                }),
              }}
            >
              <MenuItem value="">All Teams</MenuItem>
              {loadingTeams ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                </MenuItem>
              ) : (
                teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Active filters:
          </Typography>

          {filters.senderId && (
            <Box
              sx={{
                bgcolor: "primary.light",
                color: "white",
                py: 0.5,
                px: 1,
                borderRadius: 1,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                animation: "fadeIn 0.3s ease-in-out",
                "@keyframes fadeIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(5px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography variant="body2" sx={{ display: "inline" }}>
                Sender:{" "}
                {users.find((u) => u.id === filters.senderId)?.name ||
                  "Unknown"}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleClearFilter("senderId")}
                sx={{
                  p: 0,
                  ml: 0.5,
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                data-testid="clear-sender-filter"
              >
                <ClearIcon fontSize="small" sx={{ width: 14, height: 14 }} />
              </IconButton>
            </Box>
          )}

          {filters.receiverId && (
            <Box
              sx={{
                bgcolor: "primary.light",
                color: "white",
                py: 0.5,
                px: 1,
                borderRadius: 1,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                animation: "fadeIn 0.3s ease-in-out",
                "@keyframes fadeIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(5px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography variant="body2" sx={{ display: "inline" }}>
                Receiver:{" "}
                {users.find((u) => u.id === filters.receiverId)?.name ||
                  "Unknown"}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleClearFilter("receiverId")}
                sx={{
                  p: 0,
                  ml: 0.5,
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                data-testid="clear-receiver-filter"
              >
                <ClearIcon fontSize="small" sx={{ width: 14, height: 14 }} />
              </IconButton>
            </Box>
          )}

          {filters.categoryId && (
            <Box
              sx={{
                bgcolor: "primary.light",
                color: "white",
                py: 0.5,
                px: 1,
                borderRadius: 1,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                animation: "fadeIn 0.3s ease-in-out",
                "@keyframes fadeIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(5px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography variant="body2" sx={{ display: "inline" }}>
                Category:{" "}
                {categories.find((c) => c.id === filters.categoryId)?.name ||
                  "Unknown"}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleClearFilter("categoryId")}
                sx={{
                  p: 0,
                  ml: 0.5,
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                data-testid="clear-category-filter"
              >
                <ClearIcon fontSize="small" sx={{ width: 14, height: 14 }} />
              </IconButton>
            </Box>
          )}

          {filters.teamId && (
            <Box
              sx={{
                bgcolor: "primary.light",
                color: "white",
                py: 0.5,
                px: 1,
                borderRadius: 1,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                animation: "fadeIn 0.3s ease-in-out",
                "@keyframes fadeIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(5px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography variant="body2" sx={{ display: "inline" }}>
                Team:{" "}
                {teams.find((t) => t.id === filters.teamId)?.name || "Unknown"}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleClearFilter("teamId")}
                sx={{
                  p: 0,
                  ml: 0.5,
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                data-testid="clear-team-filter"
              >
                <ClearIcon fontSize="small" sx={{ width: 14, height: 14 }} />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          size="small"
          sx={{ minWidth: 100 }}
          disabled={!hasActiveFilters}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApply}
          size="small"
          sx={{
            minWidth: 100,
            position: "relative",
            ...(hasActiveFilters && {
              "&::after": {
                content: `"${activeFilterCount}"`,
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#ff5722",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              },
            }),
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};
