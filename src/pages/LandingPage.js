import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { Description, Code, CloudDownload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Description />,
      title: 'Easy Configuration',
      description: 'Simple form-based generation of Dockerfile and Docker Compose files'
    },
    {
      icon: <Code />,
      title: 'Smart Generation',
      description: 'Automatically generates optimized Docker configurations with best practices'
    },
    {
      icon: <CloudDownload />,
      title: 'Instant Download',
      description: 'Download your generated configurations with one click'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 2
        }}>
          <Typography 
            variant="h2" 
            component="span"
            sx={{ 
              fontFamily: '"Shadows Into Light", cursive',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            DOCK
          </Typography>
          <Typography 
            variant="h2" 
            component="span"
            sx={{ 
              fontFamily: '"Caveat", cursive',
              fontWeight: 500,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: '24px',
              display: 'inline-block',
              lineHeight: 1
            }}
          >
            init
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          align="center" 
          color="textSecondary" 
          paragraph
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
            fontFamily: '"Caveat", cursive',
            fontSize: '1.8rem'
          }}
        >
          Your smart companion for generating Docker configurations with ease and efficiency
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/generator')}
            sx={{
              fontFamily: '"Shadows Into Light", cursive',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              px: 4
            }}
          >
            Generate Dockerfile
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/compose-generator')}
            color="secondary"
            sx={{
              fontFamily: '"Shadows Into Light", cursive',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              px: 4
            }}
          >
            Generate Docker Compose
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontFamily: '"Shadows Into Light", cursive',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  color="textSecondary"
                  sx={{
                    fontFamily: '"Caveat", cursive',
                    fontSize: '1.2rem'
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default LandingPage; 