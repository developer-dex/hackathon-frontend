import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Typography, Container, Alert } from "@mui/material";
import { IUser, EUserRole } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";

interface ICreateKudosPageProps {
  user: IUser | null;
}

const CreateKudosPage: NextPage<ICreateKudosPageProps> = ({ user }) => {
  const router = useRouter();

  // Check if user has tech lead role on mount
  useEffect(() => {
    // Redirect if not authenticated or not a tech lead
    if (!user || !authUseCase.roleGuard.hasRole(EUserRole.TECH_LEAD)) {
      router.replace("/login");
    }
  }, [user, router]);

  // Early render with no content if not authorized
  if (!user || !authUseCase.roleGuard.hasRole(EUserRole.TECH_LEAD)) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create Kudos | KUDOS App</title>
        <meta
          name="description"
          content="Create kudos to recognize your team members"
        />
      </Head>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Kudos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Recognize your team members for their outstanding work
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          This is a protected page that only Tech Leads can access.
        </Alert>

        {/* Kudos creation form would go here */}
        <Box>
          <Typography>Kudos form placeholder...</Typography>
        </Box>
      </Container>
    </>
  );
};

export default CreateKudosPage;
