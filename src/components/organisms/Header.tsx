import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { IUser } from "@/domain/models/auth";
import { useRouter } from "next/router";

interface IHeaderProps {
  user: IUser | null;
  onLogout: () => void;
  "data-testid"?: string;
}

// Helper function to get user initials
const getUserInitials = (name: string): string => {
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${
      nameParts[nameParts.length - 1][0]
    }`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Header: React.FC<IHeaderProps> = ({
  user,
  onLogout,
  "data-testid": testId = "header",
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const isHomePage = router.pathname === "/";
  const isDashboardPage = router.pathname === "/dashboard";

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          top: 0,
          width: "100%",
          zIndex: theme.zIndex.drawer + 1,
        }}
        data-testid={testId}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{ mr: 1, height: 40, width: 120, position: "relative" }}
                >
                  <Image
                    src="/images/kudos-logo.svg"
                    alt="KUDOS App Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </Box>
              </Box>
            </Link>
          </Box>

          {/* Mobile Menu */}
          {isMobile ? (
            <>
              {!user ? (
                // Show login and signup buttons for mobile when not logged in
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link href="/login" passHref>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: "medium",
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                      }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </Box>
              ) : (
                // Show user avatar or initials for mobile when logged in
                <IconButton
                  onClick={handleMobileMenu}
                  sx={{ p: 0 }}
                  aria-label="user menu"
                >
                  <Avatar
                    alt={user.name}
                    src={user.profileImage || ""}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      color: "white",
                    }}
                  >
                    {!user.profileImage && getUserInitials(user.name)}
                  </Avatar>
                </IconButton>
              )}

              {/* Mobile Menu dropdown (only shown when logged in) */}
              {user && (
                <Menu
                  anchorEl={mobileMenuAnchorEl}
                  open={Boolean(mobileMenuAnchorEl)}
                  onClose={handleMobileMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 200, mt: 1 },
                  }}
                >
                  <MenuItem onClick={handleMobileMenuClose}>
                    <Link href="/" passHref>
                      <Typography
                        sx={{
                          width: "100%",
                          cursor: "pointer",
                          color: isHomePage ? "primary.main" : "inherit",
                          fontWeight: isHomePage ? "bold" : "normal",
                        }}
                      >
                        Kudos Wall
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleMobileMenuClose}>
                    <Link href="/dashboard" passHref>
                      <Typography
                        sx={{
                          width: "100%",
                          cursor: "pointer",
                          color: isDashboardPage ? "primary.main" : "inherit",
                          fontWeight: isDashboardPage ? "bold" : "normal",
                        }}
                      >
                        Analytics Dashboard
                      </Typography>
                    </Link>
                  </MenuItem>
                  {user && user.role === "Team Lead" && (
                    <MenuItem onClick={handleMobileMenuClose}>
                      <Link href="/create-kudos" passHref>
                        <Typography sx={{ width: "100%", cursor: "pointer" }}>
                          Create Kudos
                        </Typography>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleMobileMenuClose}>
                    <Link href="/profile" passHref>
                      <Typography sx={{ width: "100%", cursor: "pointer" }}>
                        Profile
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onLogout();
                      handleMobileMenuClose();
                    }}
                  >
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              )}
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Navigation links */}
              <Link href="/" passHref>
                <Button
                  color="inherit"
                  sx={{
                    mx: 1,
                    textTransform: "none",
                    cursor: "pointer",
                    color: isHomePage ? "primary.main" : "text.primary",
                    fontWeight: isHomePage ? "bold" : "normal",
                    borderBottom: isHomePage ? "2px solid" : "none",
                    borderColor: isHomePage ? "primary.main" : "transparent",
                    borderRadius: 0,
                    paddingBottom: "4px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "primary.main",
                    },
                  }}
                >
                  Kudos Wall
                </Button>
              </Link>
              <Link href="/dashboard" passHref>
                <Button
                  color="inherit"
                  sx={{
                    mx: 1,
                    textTransform: "none",
                    cursor: "pointer",
                    color: isDashboardPage ? "primary.main" : "text.primary",
                    fontWeight: isDashboardPage ? "bold" : "normal",
                    borderBottom: isDashboardPage ? "2px solid" : "none",
                    borderColor: isDashboardPage
                      ? "primary.main"
                      : "transparent",
                    borderRadius: 0,
                    paddingBottom: "4px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "primary.main",
                    },
                  }}
                >
                  Analytics Dashboard
                </Button>
              </Link>

              {/* Team Lead Create Kudos Button */}
              {user && user.role === "Team Lead" && (
                <Link href="/create-kudos" passHref>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      ml: 2,
                      textTransform: "none",
                      borderRadius: "20px",
                    }}
                  >
                    Create Kudos
                  </Button>
                </Link>
              )}

              {/* Authentication Section */}
              {user ? (
                <>
                  {/* User avatar dropdown menu for desktop */}
                  <Box sx={{ ml: 2 }}>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                      sx={{ p: 0 }}
                    >
                      <Avatar
                        src={user.profileImage || ""}
                        alt={user.name}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.main",
                          color: "white",
                        }}
                      >
                        {!user.profileImage && getUserInitials(user.name)}
                      </Avatar>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                        <Link href="/profile" passHref>
                          <Typography sx={{ color: "inherit" }}>
                            Profile
                          </Typography>
                        </Link>
                      </MenuItem>
                      {user && user.role === "Team Lead" && (
                        <MenuItem onClick={handleClose}>
                          <Link href="/create-kudos" passHref>
                            <Typography sx={{ color: "inherit" }}>
                              Create Kudos
                            </Typography>
                          </Link>
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          onLogout();
                          handleClose();
                        }}
                      >
                        <Typography color="error">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                // Auth buttons for desktop when not logged in
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link href="/login" passHref>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
