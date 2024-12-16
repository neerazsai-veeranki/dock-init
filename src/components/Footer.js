import React from 'react';
import { Box, Typography } from '@mui/material';
import { Copyright } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
      >
        <Copyright fontSize="small" />
        2024 Neerazsai Veeranki | DOCK-init | All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer; 