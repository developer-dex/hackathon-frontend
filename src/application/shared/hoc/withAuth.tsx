import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authUseCase } from "@/application/useCases";
import { NextPage } from "next";
import { IUser } from "@/domain/models/auth";

type NextPageContext = {
  pathname: string;
  query: Record<string, string | string[]>;
  asPath: string;
  req?: unknown;
  res?: unknown;
};

type NextPageWithInitialProps<P = object> = NextPage<P> & {
  getInitialProps?: (context: NextPageContext) => Promise<P> | P;
};

/**
 * Higher Order Component (HOC) to protect routes that require authentication
 * @param Component The component to wrap with authentication
 */
function withAuth<P extends object>(Component: NextPageWithInitialProps<P>) {
  const AuthComponent = (
    props: P & { user?: IUser | null; onLogout?: () => void }
  ) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Check authentication status
      const checkAuth = () => {
        const authStatus = authUseCase.checkAuth.execute();
        setIsAuthenticated(authStatus);
        setIsChecking(false);

        if (!authStatus) {
          // Redirect to login with a redirect parameter back to this page
          router.replace(`/login?redirectTo=${router.pathname}`);
        }
      };

      checkAuth();
    }, [router]);

    // While checking auth status, return nothing or a loading indicator
    if (isChecking) {
      return null;
    }

    // If authenticated, render the protected component
    return isAuthenticated ? <Component {...props} /> : null;
  };

  // Copy getInitialProps if it exists on the wrapped component
  if (Component.getInitialProps) {
    AuthComponent.getInitialProps = Component.getInitialProps;
  }

  return AuthComponent as NextPage<P>;
}

export default withAuth;
