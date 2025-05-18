"use client";

import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import { KudosWall } from "@/components/organisms/KudosWall";
import { authUseCase } from "@/application/useCases";
import { kudosUseCases } from "@/application/useCases";
import { IKudos } from "@/domain/entities/Kudos.types";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";

interface ProfilePageProps {
  user: IUser | null;
  onLogout: () => void;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ user, onLogout }) => {
  const [kudosList, setKudosList] = useState<IKudos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const CLIMIT = 9;

  // Initialize user data on client side only
  useEffect(() => {
    // Get the current user on client side to avoid hydration errors
    const currentUser = authUseCase.checkAuth.getCurrentUser();
    setUserName(currentUser?.name || "");

    if (currentUser?.id) {
      fetchKudos(currentUser.id);
    }
  }, []);

  const fetchKudos = async (userId: string) => {
    try {
      setLoading(true);
      // Filter kudos by the current user's ID as receiver
      const filters = { receiverId: userId || "" };
      const result = await kudosUseCases.getKudosList.execute(
        0, // Always start from the beginning
        CLIMIT,
        filters
      );

      // Always replace the list with fresh data
      setKudosList(result.kudosList);
      setHasMore(result.totalCount > result.kudosList.length);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch kudos:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Your Profile | Kudos App</title>
        <meta name="description" content="View your received kudos" />
      </Head>
      <MainLayout user={user} onLogout={onLogout}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {userName ? `Welcome, ${userName}!` : "Welcome!"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                align="center"
              >
                Here are all the kudos you&apos;ve received from your
                colleagues.
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />
          </Paper>

          <KudosWall
            title="Your Received Kudos"
            kudosList={kudosList}
            hasMore={hasMore}
            isLoading={loading}
            onLoadMore={() => {
              const currentUser = authUseCase.checkAuth.getCurrentUser();
              if (currentUser?.id) {
                const newOffset = kudosList.length;
                const filters = { receiverId: currentUser.id || "" };
                kudosUseCases.getKudosList
                  .execute(newOffset, CLIMIT, filters)
                  .then((result) => {
                    setKudosList([...kudosList, ...result.kudosList]);
                    setHasMore(
                      result.totalCount >
                        kudosList.length + result.kudosList.length
                    );
                  })
                  .catch((error) => {
                    console.error("Failed to load more kudos:", error);
                  });
              }
            }}
            hideLoadMore={false}
          />
        </Container>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
