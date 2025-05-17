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
}

const Header: React.FC<IHeaderProps> = ({ user, onLogout }) => {
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
    <AppBar position="static" color="default" elevation={1}>
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
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchorEl}
              open={Boolean(mobileMenuAnchorEl)}
              onClose={handleMobileMenuClose}
            >
              {!user ? (
                <>
                  <MenuItem onClick={handleMobileMenuClose}>
                    <Link href="/login" passHref>
                      <Typography sx={{ width: "100%", cursor: "pointer" }}>
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
                    <Link href="/kudos" passHref>
                      <Typography sx={{ width: "100%", cursor: "pointer" }}>
                        All Kudos
                      </Typography>
                    </Link>
                  </MenuItem>
                  {user.role === EUserRole.TECH_LEAD && (
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
                    <Typography>Logout</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/kudos" passHref>
              <Button
                color="inherit"
                sx={{ mx: 1, textTransform: "none", cursor: "pointer" }}
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
                    >
                      Create Kudos
                    </Button>
                  </Link>
                )}
                <Box sx={{ ml: 2 }}>
                  <IconButton onClick={handleMenu} sx={{ p: 0 }}>
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
                  >
                    <MenuItem>
                      <Typography variant="body2">{user.name}</Typography>
                    </MenuItem>
                    <MenuItem>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                      <Link href="/profile" passHref>
                        <Typography sx={{ cursor: "pointer" }}>
                          Profile
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button
                    color="inherit"
                    sx={{ ml: 1, textTransform: "none", cursor: "pointer" }}
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
