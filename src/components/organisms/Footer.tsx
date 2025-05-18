import React from "react";
import { Box, Container, Typography, Divider, Grid, useTheme, IconButton } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

interface IFooterProps {
  "data-testid"?: string;
}

const Footer: React.FC<IFooterProps> = ({
  "data-testid": testId = "footer",
}) => {
  const theme = useTheme();
  
  // Column definitions
  const footerColumns = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "How It Works", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Use Cases", href: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Guides", href: "#" },
        { name: "API Docs", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact Us", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ]
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      }}
      data-testid={testId}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and company info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Image
                src="/images/kudos-logo.svg"
                alt="KUDOS App Logo"
                width={120}
                height={40}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Recognize and appreciate your team members with our powerful recognition platform
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" aria-label="GitHub" sx={{ color: theme.palette.primary.main }}>
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Twitter" sx={{ color: theme.palette.primary.main }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="LinkedIn" sx={{ color: theme.palette.primary.main }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="Email" sx={{ color: theme.palette.primary.main }}>
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer columns */}
          {footerColumns.map((column, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
              <Typography variant="subtitle2" color="text.primary" fontWeight={600} sx={{ mb: 2 }}>
                {column.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {column.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        cursor: "pointer",
                        textDecoration: "none",
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} data-testid={`${testId}-divider`} />
        
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
          data-testid={`${testId}-content`}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} KUDOS App - All rights reserved
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 1, sm: 0 } }}>
            Made with ❤️ By IndieHackers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
