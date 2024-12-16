import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import ComposeGeneratorPage from './pages/ComposeGeneratorPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1,
              mt: { 
                xs: '56px',
                sm: '64px'
              },
              position: 'relative'
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/compose-generator" element={<ComposeGeneratorPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 