import React, { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import { IUser } from "@/domain/models/auth";

interface IMainLayoutProps {
  children: ReactNode;
  user: IUser | null;
  onLogout: () => void;
}

/**
 * Main layout component that includes header and footer
 */
const MainLayout: React.FC<IMainLayoutProps> = ({
  children,
  user,
  onLogout,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header user={user} onLogout={onLogout} />
      <Container
        component="main"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;
