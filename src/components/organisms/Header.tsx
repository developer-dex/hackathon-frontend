import React from "react";
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
import Link from "next/link";
import { IUser, EUserRole } from "@/domain/models/auth";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

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
    <AppBar
      position="static"
      color="default"
      elevation={1}
      data-testid={testId}
    >
      <Toolbar>
        <Link href="/" passHref>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "primary.main",
              cursor: "pointer",
            }}
            data-testid={`${testId}-logo`}
          >
            KUDOS App
          </Typography>
        </Link>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenu}
              data-testid={`${testId}-mobile-menu-button`}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchorEl}
              open={Boolean(mobileMenuAnchorEl)}
              onClose={handleMobileMenuClose}
              data-testid={`${testId}-mobile-menu`}
            >
              {!user ? (
                <>
                  <MenuItem
                    onClick={handleMobileMenuClose}
                    data-testid={`${testId}-mobile-login`}
                  >
                    <Link href="/login" passHref>
                      <Typography sx={{ width: "100%", cursor: "pointer" }}>
                        Login
                      </Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={handleMobileMenuClose}
                    data-testid={`${testId}-mobile-signup`}
                  >
                    <Link href="/signup" passHref>
                      <Typography sx={{ width: "100%", cursor: "pointer" }}>
                        Sign Up
                      </Typography>
                    </Link>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={handleMobileMenuClose}
                    data-testid={`${testId}-mobile-kudos`}
                  >
                    <Link href="/kudos" passHref>
                      <Typography sx={{ width: "100%", cursor: "pointer" }}>
                        All Kudos
                      </Typography>
                    </Link>
                  </MenuItem>
                  {user.role === EUserRole.TECH_LEAD && (
                    <MenuItem
                      onClick={handleMobileMenuClose}
                      data-testid={`${testId}-mobile-create-kudos`}
                    >
                      <Link href="/create-kudos" passHref>
                        <Typography sx={{ width: "100%", cursor: "pointer" }}>
                          Create Kudos
                        </Typography>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={handleMobileMenuClose}
                    data-testid={`${testId}-mobile-profile`}
                  >
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
                    data-testid={`${testId}-mobile-logout`}
                  >
                    <Typography>Logout</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            data-testid={`${testId}-desktop-menu`}
          >
            <Link href="/kudos" passHref>
              <Button
                color="inherit"
                sx={{ mx: 1, textTransform: "none", cursor: "pointer" }}
                data-testid={`${testId}-desktop-kudos`}
              >
                All Kudos
              </Button>
            </Link>

            {user ? (
              <>
                {user.role === EUserRole.TECH_LEAD && (
                  <Link href="/create-kudos" passHref>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        mx: 1,
                        textTransform: "none",
                        cursor: "pointer",
                      }}
                      data-testid={`${testId}-desktop-create-kudos`}
                    >
                      Create Kudos
                    </Button>
                  </Link>
                )}
                <Box sx={{ ml: 2 }} data-testid={`${testId}-user-menu`}>
                  <IconButton
                    onClick={handleMenu}
                    sx={{ p: 0 }}
                    data-testid={`${testId}-user-avatar`}
                  >
                    <Avatar
                      alt={user.name}
                      src="/images/avatar.jpg"
                      sx={{ width: 36, height: 36 }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    data-testid={`${testId}-user-dropdown`}
                  >
                    <MenuItem data-testid={`${testId}-user-name`}>
                      <Typography variant="body2">{user.name}</Typography>
                    </MenuItem>
                    <MenuItem data-testid={`${testId}-user-email`}>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem data-testid={`${testId}-user-profile`}>
                      <Link href="/profile" passHref>
                        <Typography sx={{ cursor: "pointer" }}>
                          Profile
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={onLogout}
                      data-testid={`${testId}-user-logout`}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button
                    color="inherit"
                    sx={{ ml: 1, textTransform: "none", cursor: "pointer" }}
                    data-testid={`${testId}-desktop-login`}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      ml: 1,
                      textTransform: "none",
                      cursor: "pointer",
                    }}
                    data-testid={`${testId}-desktop-signup`}
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
  );
};

export default Header;
