import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} KUDOS App - Recognize and appreciate
              your team members
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 3, mt: { xs: 2, sm: 0 } }}>
            <Link href="/about" passHref>
              <Typography
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                About
              </Typography>
            </Link>
            <Link href="/privacy" passHref>
              <Typography
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Privacy
              </Typography>
            </Link>
            <Link href="/terms" passHref>
              <Typography
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Terms
              </Typography>
            </Link>
            <Link href="/contact" passHref>
              <Typography
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Contact
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
