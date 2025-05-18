"use client";

import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { KudosWall } from "@/components/organisms/KudosWall";
import { kudosUseCases } from "@/application/useCases";
import { IKudos } from "@/domain/entities/Kudos.types";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";
import { useRouter } from "next/router";

interface UserProfilePageProps {
  user: IUser | null;
  onLogout: () => void;
}

const UserProfilePage: NextPage<UserProfilePageProps> = ({
  user,
  onLogout,
}) => {
  const router = useRouter();
  const { userId } = router.query;

  const [kudosList, setKudosList] = useState<IKudos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userTeam, setUserTeam] = useState<string>("");
  const CLIMIT = 9;
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    if (userId && typeof userId === "string") {
      // Reset the offset and kudos list when userId changes
      setOffset(0);
      setKudosList([]);
      fetchUserKudos(userId, 0);
    }
  }, [userId]);

  const fetchUserKudos = async (uId: string, currentOffset: number) => {
    try {
      setLoading(true);
      // Filter kudos by the specified user's ID as receiver
      const filters = { receiverId: uId };
      const result = await kudosUseCases.getKudosList.execute(
        currentOffset,
        CLIMIT,
        filters
      );

      // Set the user name from the first kudos card if available
      if (result.kudosList.length > 0 && currentOffset === 0) {
        const firstKudos = result.kudosList[0];
        setUserName(firstKudos.recipientName || "");
        setUserTeam(firstKudos.recipientTeam || "");
      }

      if (currentOffset === 0) {
        // Replace the list for initial load
        setKudosList(result.kudosList);
      } else {
        // Append new kudos for subsequent loads
        setKudosList((prevKudos) => [...prevKudos, ...result.kudosList]);
      }

      setHasMore(currentOffset + CLIMIT < result.totalCount);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user kudos:", error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (userId && typeof userId === "string" && !loading && hasMore) {
      const newOffset = offset + CLIMIT;
      setOffset(newOffset);
      fetchUserKudos(userId, newOffset);
    }
  };

  return (
    <>
      <Head>
        <title>
          {userName ? `${userName}'s Profile` : "User Profile"} | Kudos App
        </title>
        <meta name="description" content="View user's received kudos" />
      </Head>
      <MainLayout user={user} onLogout={onLogout}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {loading && kudosList.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
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
                    {userName ? `${userName}'s Profile` : "User Profile"}
                  </Typography>
                  {userTeam && (
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      align="center"
                    >
                      Team: {userTeam}
                    </Typography>
                  )}
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    All kudos received by this user
                  </Typography>
                </Box>
                <Divider sx={{ mb: 4 }} />
              </Paper>

              <KudosWall
                title={`${userName ? `${userName}'s` : "User"} Received Kudos`}
                kudosList={kudosList}
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={loadMore}
                hideLoadMore={true}
              />
            </>
          )}
        </Container>
      </MainLayout>
    </>
  );
};

export default UserProfilePage;
