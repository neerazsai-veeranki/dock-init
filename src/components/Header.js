import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed"
      color="primary" 
      elevation={2}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <Box 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          onClick={() => navigate('/')}
        >
          <Typography 
            variant="h5" 
            component="span"
            sx={{ 
              fontFamily: '"Shadows Into Light", cursive',
              fontWeight: 'bold',
              letterSpacing: '1px',
              fontSize: '1.8rem'
            }}
          >
            DOCK
          </Typography>
          <Typography 
            variant="h5" 
            component="span"
            sx={{ 
              fontFamily: '"Caveat", cursive',
              fontWeight: 500,
              backgroundColor: 'white',
              color: 'primary.main',
              px: 1.5,
              py: 0.5,
              borderRadius: '16px',
              display: 'inline-block',
              fontSize: '1.6rem',
              lineHeight: 1
            }}
          >
            init
          </Typography>
        </Box>
        <Button 
          color="inherit" 
          startIcon={<Chat />}
          onClick={() => window.open('https://www.linkedin.com/in/neerazsai-veeranki/', '_blank')}
        >
          Talk To Me
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 