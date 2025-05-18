import "@/styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastInfo } from "@/application/shared/utils/toast";

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
  // State for authenticated user - initialized to null to avoid hydration mismatch
  const [user, setUser] = useState<IUser | null>(null);
  // State to track if the component has been mounted to avoid hydration mismatches
  const [isClientSide, setIsClientSide] = useState(false);

  // Check for existing authentication on initial load
  useEffect(() => {
    // Mark that we're now rendering on the client
    setIsClientSide(true);

    // Check if user is authenticated
    const isAuthenticated = authUseCase.checkAuth.execute();
    if (isAuthenticated) {
      // Get the current user from storage
      const currentUser = authUseCase.checkAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    const userName = user?.name || "User";
    authUseCase.logout.execute();
    setUser(null);

    // Show logout toast notification
    if (isClientSide) {
      toastInfo(`${userName} has been logged out successfully.`);
    }
  };

  // Create combined props to pass to pages
  const enhancedPageProps = {
    ...pageProps,
    user,
    setUser,
    onLogout: handleLogout,
  };

  // Return a simpler version on server-side to ensure hydration consistency
  if (!isClientSide) {
    return (
      <ThemeProvider theme={CTHEME}>
        <CssBaseline />
        <Component
          {...pageProps}
          user={null}
          setUser={setUser}
          onLogout={handleLogout}
        />
      </ThemeProvider>
    );
  }

  // Full version once we're on the client
  return (
    <ThemeProvider theme={CTHEME}>
      <CssBaseline />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          borderRadius: "8px",
          fontFamily: CTHEME.typography.fontFamily,
        }}
      />
      <Component {...enhancedPageProps} />
    </ThemeProvider>
  );
}
