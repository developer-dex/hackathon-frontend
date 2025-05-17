import "@/styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";

// Create Material UI theme
const CTHEME = createTheme({
  palette: {
    primary: {
      main: "#6C5CE7",
    },
    secondary: {
      main: "#D94AE6",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  // State for authenticated user
  const [user, setUser] = useState<IUser | null>(null);

  // Check for existing authentication on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      // const isAuthenticated = authUseCase.checkAuth.execute();
      // if (isAuthenticated) {
      //   // Get the current user from storage
      //   const currentUser = authUseCase.checkAuth.getCurrentUser();
      //   if (currentUser) {
      //     setUser(currentUser);
      //   }
      // }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    authUseCase.logout.execute();
    setUser(null);
  };

  // Create combined props to pass to pages
  const enhancedPageProps = {
    ...pageProps,
    user,
    setUser,
    onLogout: handleLogout,
  };

  return (
    <ThemeProvider theme={CTHEME}>
      <CssBaseline />
      <Component {...enhancedPageProps} />
    </ThemeProvider>
  );
}
