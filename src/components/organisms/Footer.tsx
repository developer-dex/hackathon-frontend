import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import Link from "next/link";

interface IFooterProps {
  "data-testid"?: string;
}

const Footer: React.FC<IFooterProps> = ({
  "data-testid": testId = "footer",
}) => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
      }}
      data-testid={testId}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} data-testid={`${testId}-divider`} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
          data-testid={`${testId}-content`}
        >
          <Box data-testid={`${testId}-copyright`}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} KUDOS App - Recognize and appreciate
              your team members
            </Typography>
          </Box>

          <Box
            sx={{ display: "flex", gap: 3, mt: { xs: 2, sm: 0 } }}
            data-testid={`${testId}-links`}
          >
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
                data-testid={`${testId}-about-link`}
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
                data-testid={`${testId}-privacy-link`}
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
                data-testid={`${testId}-terms-link`}
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
                data-testid={`${testId}-contact-link`}
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
