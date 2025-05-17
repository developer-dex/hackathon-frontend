import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import Image from "next/image";
import { IUser, EUserRole } from "@/domain/models/auth";
import { useRouter } from "next/router";

interface IHeaderProps {
  user: IUser | null;
  onLogout: () => void;
  "data-testid"?: string;
}

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
        position="static"
        elevation={2}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
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
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenu}
                sx={{ color: "primary.main" }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 200, mt: 1 },
                }}
              >
                {!user ? (
                  <>
                    <MenuItem onClick={handleMobileMenuClose}>
                      <Link href="/login" passHref>
                        <Typography
                          sx={{
                            color: "primary.main",
                            fontWeight: "medium",
                            width: "100%",
                          }}
                        >
                          Login
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleMobileMenuClose}>
                      <Link href="/signup" passHref>
                        <Typography sx={{ width: "100%", cursor: "pointer" }}>
                          Sign Up
                        </Typography>
                      </Link>
                    </MenuItem>
                  </>
                ) : (
                  <>
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
                    {user.role === EUserRole.TECH_LEAD && (
                      <MenuItem onClick={handleMobileMenuClose}>
                        <Link href="/kudos/new" passHref>
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
                  </>
                )}
              </Menu>
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

              {/* Authentication Section */}
              {user ? (
                <>
                  {/* Create Kudos Button (only for tech leads) */}
                  {user.role === EUserRole.TECH_LEAD && (
                    <Link href="/kudos/new" passHref>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          mx: 2,
                          textTransform: "none",
                          cursor: "pointer",
                          borderRadius: "20px",
                          px: 3,
                        }}
                      >
                        Create Kudos
                      </Button>
                    </Link>
                  )}

                  {/* User profile avatar and menu */}
                  <Box sx={{ ml: 1 }}>
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        p: 0.5,
                        border: "2px solid transparent",
                        "&:hover": {
                          border: "2px solid",
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Avatar
                        alt={user.name}
                        src="/images/avatar.jpg"
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: "primary.light",
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      PaperProps={{
                        elevation: 3,
                        sx: { minWidth: 200, mt: 1 },
                      }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ wordBreak: "break-all" }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <MenuItem onClick={handleClose}>
                        <Link href="/profile" passHref>
                          <Typography sx={{ cursor: "pointer" }}>
                            My Profile
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={onLogout} sx={{ color: "error.main" }}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Link href="/login" passHref>
                    <Button
                      color="primary"
                      startIcon={<AccountCircleIcon />}
                      sx={{
                        ml: 1,
                        textTransform: "none",
                        cursor: "pointer",
                        borderRadius: "20px",
                        "&:hover": {
                          backgroundColor: "rgba(108, 92, 231, 0.1)",
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Link>

                  {/* Sign Up Button */}
                  <Link href="/signup" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        ml: 1,
                        textTransform: "none",
                        cursor: "pointer",
                        borderRadius: "20px",
                        px: 3,
                      }}
                      data-testid={`${testId}-desktop-create-kudos`}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
