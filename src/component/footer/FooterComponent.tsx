import React, { JSX } from "react";

import { Box, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, GitHub } from "@mui/icons-material";

const Footer: React.FC = ():JSX.Element => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "1rem 1rem",
        
        textAlign: "center",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2" color="textSecondary" gutterBottom>
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
        <Link href="/about" underline="hover">
          About
        </Link>
        <Link href="/contact" underline="hover">
          Contact
        </Link>
        <Link href="/privacy" underline="hover">
          Privacy Policy
        </Link>
        <Link href="/terms" underline="hover">
          Terms of Use
        </Link>
      </Box>

      <Box>
        <IconButton
          component="a"
          href="https://facebook.com"
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
        >
          <Facebook />
        </IconButton>
        <IconButton
          component="a"
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
        >
          <Instagram />
        </IconButton>
        <IconButton
          component="a"
          href="https://github.com"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
        >
          <GitHub />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
