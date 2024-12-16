import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Download, ArrowBack, Add, Delete, Help, Folder } from '@mui/icons-material';

// Comprehensive list of common Docker base images
const baseImages = [
  { name: 'alpine', versions: ['latest', '3.14', '3.15', '3.16'] },
  { name: 'nginx', versions: ['latest', '1.21', '1.20', 'alpine'] },
  { name: 'node', versions: ['latest', '16-alpine', '14-alpine', '18-alpine', '16', '14', '18'] },
  { name: 'python', versions: ['latest', '3.9', '3.8', '3.10', 'alpine'] },
  { name: 'ubuntu', versions: ['latest', '20.04', '18.04', '22.04'] },
  { name: 'php', versions: ['latest', '8.0', '7.4', '8.1', 'apache'] },
  { name: 'mysql', versions: ['latest', '8.0', '5.7', '5.6'] },
  { name: 'postgres', versions: ['latest', '14', '13', '12', 'alpine'] },
  { name: 'redis', versions: ['latest', '6', '7', 'alpine'] },
  { name: 'maven', versions: ['latest', '3.8-jdk-11', '3.8-jdk-8'] },
].sort((a, b) => a.name.localeCompare(b.name));

// Add this new component for the directory browser
const DirectoryBrowser = ({ value, onChange }) => {
  const directoryInputRef = React.useRef();

  const handleDirectorySelect = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        onChange(`/${dirHandle.name}`);
      } else {
        directoryInputRef.current?.click();
      }
    } catch (err) {
      console.error('Error selecting directory:', err);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'background.paper',
        '&:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {value || 'No directory selected'}
        </Typography>
      </Box>
      <Button
        size="small"
        startIcon={<Folder />}
        onClick={handleDirectorySelect}
        variant="contained"
        sx={{ minWidth: '120px' }}
      >
        Browse
      </Button>
      <input
        type="file"
        ref={directoryInputRef}
        style={{ display: 'none' }}
        webkitdirectory="true"
        directory="true"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            const path = e.target.files[0].webkitRelativePath.split('/')[0];
            onChange(`/${path}`);
          }
        }}
      />
    </Paper>
  );
};

function GeneratorPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [customImageDialog, setCustomImageDialog] = useState(false);
  const [customImage, setCustomImage] = useState({ name: '', version: '' });
  const [useCustomImage, setUseCustomImage] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    workDir: '/app',
    ports: [{ container: '3000', host: '3000' }],
    environment: [{ key: '', value: '' }],
    volumes: [{ host: '', container: '' }],
    commands: [{ type: 'RUN', command: '' }],
    entrypoint: '',
    user: '',
    labels: [{ key: '', value: '' }],
    args: [{ key: '', value: '' }],
    copyFiles: [{ src: '', dest: '' }],
    runCommands: [{ command: '' }],
  });

  const [dockerfile, setDockerfile] = useState('');

  const handleArrayFieldAdd = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], getEmptyObject(fieldName)]
    });
  };

  const handleArrayFieldRemove = (fieldName, index) => {
    const newArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [fieldName]: newArray
    });
  };

  const getEmptyObject = (fieldName) => {
    switch (fieldName) {
      case 'ports': return { container: '', host: '' };
      case 'environment': return { key: '', value: '' };
      case 'volumes': return { host: '', container: '' };
      case 'commands': return { type: 'RUN', command: '' };
      case 'labels': return { key: '', value: '' };
      case 'args': return { key: '', value: '' };
      case 'copyFiles': return { src: '', dest: '' };
      case 'runCommands': return { command: '' };
      default: return {};
    }
  };

  // Add useEffect to automatically generate Dockerfile
  React.useEffect(() => {
    generateDockerfile();
  }, [formData, selectedImage, selectedVersion, customImage, useCustomImage]); // Dependencies array includes all relevant state

  // Move generateDockerfile function definition here
  const generateDockerfile = () => {
    let content = [];

    // Base image section
    if (useCustomImage) {
      if (customImage.name && customImage.version) {
        content.push(`# Base image\nFROM ${customImage.name}:${customImage.version}\n`);
      }
    } else {
      if (selectedImage && selectedVersion) {
        content.push(`# Base image\nFROM ${selectedImage.name}:${selectedVersion}\n`);
      }
    }

    // Add ARGs
    if (formData.args.some(arg => arg.key)) {
      content.push('# Build arguments');
      formData.args.forEach(arg => {
        if (arg.key) {
          content.push(`ARG ${arg.key}=${arg.value}`);
        }
      });
      content.push('');
    }

    // Add labels
    if (formData.labels.some(label => label.key)) {
      content.push('# Labels');
      formData.labels.forEach(label => {
        if (label.key) {
          content.push(`LABEL ${label.key}="${label.value}"`);
        }
      });
      content.push('');
    }

    // Add environment variables
    if (formData.environment.some(env => env.key)) {
      content.push('# Environment variables');
      formData.environment.forEach(env => {
        if (env.key) {
          content.push(`ENV ${env.key}=${env.value}`);
        }
      });
      content.push('');
    }

    // Add working directory
    if (formData.workDir) {
      content.push(`# Set working directory\nWORKDIR ${formData.workDir}\n`);
    }

    // Add user
    if (formData.user) {
      content.push(`# Set user\nUSER ${formData.user}\n`);
    }

    // Add COPY instructions
    if (formData.copyFiles.some(file => file.src)) {
      content.push('# Copy files');
      formData.copyFiles.forEach(file => {
        if (file.src) {
          content.push(`COPY ${file.src} ${file.dest}`);
        }
      });
      content.push('');
    }

    // Add RUN commands
    if (formData.commands.some(cmd => cmd.command)) {
      content.push('# Run commands');
      formData.commands.forEach(cmd => {
        if (cmd.command) {
          content.push(`${cmd.type} ${cmd.command}`);
        }
      });
      content.push('');
    }

    // Add volumes
    if (formData.volumes.some(vol => vol.container)) {
      content.push('# Set volumes');
      formData.volumes.forEach(vol => {
        if (vol.container) {
          content.push(`VOLUME ${vol.container}`);
        }
      });
      content.push('');
    }

    // Add exposed ports
    if (formData.ports.some(port => port.container)) {
      content.push('# Expose ports');
      formData.ports.forEach(port => {
        if (port.container) {
          content.push(`EXPOSE ${port.container}`);
        }
      });
      content.push('');
    }

    // Add entrypoint
    if (formData.entrypoint) {
      content.push(`# Set entrypoint\nENTRYPOINT ${formData.entrypoint}\n`);
    }

    // Add RUN commands at the end
    if (formData.runCommands.some(cmd => cmd.command)) {
      content.push('# Run commands');
      formData.runCommands.forEach(cmd => {
        if (cmd.command) {
          content.push(`RUN ${cmd.command}`);
        }
      });
      content.push('');
    }

    setDockerfile(content.join('\n'));
  };

  const downloadDockerfile = () => {
    // Create the Dockerfile content with correct MIME type
    const element = document.createElement('a');
    const file = new Blob([dockerfile], { type: 'application/x-docker' });
    element.href = URL.createObjectURL(file);
    
    // Set the filename without any extension
    const filename = formData.projectName 
      ? `Dockerfile_${formData.projectName.replace(/[^a-zA-Z0-9]/g, '_')}` 
      : 'Dockerfile';
    
    // Force download with specific attributes
    element.setAttribute('download', filename);
    element.setAttribute('type', 'application/x-docker');
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  // Handle custom image addition
  const handleAddCustomImage = () => {
    if (customImage.name && customImage.version) {
      const newImage = {
        name: customImage.name,
        versions: [customImage.version]
      };
      setSelectedImage(newImage);
      setSelectedVersion(customImage.version);
      setCustomImageDialog(false);
      setUseCustomImage(true);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 128px)' }}>
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Box sx={{ py: 4 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            sx={{ mb: 4 }}
          >
            Back to Home
          </Button>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                pr: 2
              }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Configure Your Dockerfile
                  </Typography>
                  
                  <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      sx={{ mb: 2 }}
                    />

                    {/* Base Image Selection */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useCustomImage}
                          onChange={(e) => setUseCustomImage(e.target.checked)}
                        />
                      }
                      label="Use custom base image"
                      sx={{ mb: 2 }}
                    />

                    {useCustomImage ? (
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Custom Image Name"
                            value={customImage.name}
                            onChange={(e) => setCustomImage({ ...customImage, name: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Version/Tag"
                            value={customImage.version}
                            onChange={(e) => setCustomImage({ ...customImage, version: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            variant="contained"
                            onClick={handleAddCustomImage}
                            fullWidth
                            sx={{ height: '100%' }}
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Autocomplete
                            options={baseImages}
                            getOptionLabel={(option) => option.name}
                            value={selectedImage}
                            onChange={(_, newValue) => {
                              setSelectedImage(newValue);
                              setSelectedVersion('');
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Base Image" />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <InputLabel>Version</InputLabel>
                            <Select
                              value={selectedVersion}
                              label="Version"
                              onChange={(e) => setSelectedVersion(e.target.value)}
                              disabled={!selectedImage}
                            >
                              {selectedImage?.versions.map((version) => (
                                <MenuItem key={version} value={version}>
                                  {version}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}

                    {/* Working Directory with new DirectoryBrowser */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Working Directory
                        <Tooltip title="Select the working directory for your Docker container">
                          <IconButton size="small">
                            <Help fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <DirectoryBrowser
                        value={formData.workDir}
                        onChange={(newPath) => setFormData({ ...formData, workDir: newPath })}
                      />
                    </Box>

                    {/* Environment Variables */}
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Environment Variables
                      <Tooltip title="Add environment variables that will be available in your container">
                        <IconButton size="small">
                          <Help fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    {formData.environment.map((env, index) => (
                      <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Key"
                            value={env.key}
                            onChange={(e) => {
                              const newEnv = [...formData.environment];
                              newEnv[index].key = e.target.value;
                              setFormData({...formData, environment: newEnv});
                            }}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Value"
                            value={env.value}
                            onChange={(e) => {
                              const newEnv = [...formData.environment];
                              newEnv[index].value = e.target.value;
                              setFormData({...formData, environment: newEnv});
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton onClick={() => handleArrayFieldRemove('environment', index)}>
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleArrayFieldAdd('environment')}
                      sx={{ mb: 2 }}
                    >
                      Add Environment Variable
                    </Button>

                    {/* Ports */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Ports
                    </Typography>
                    {formData.ports.map((port, index) => (
                      <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Container Port"
                            value={port.container}
                            onChange={(e) => {
                              const newPorts = [...formData.ports];
                              newPorts[index].container = e.target.value;
                              setFormData({...formData, ports: newPorts});
                            }}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            label="Host Port"
                            value={port.host}
                            onChange={(e) => {
                              const newPorts = [...formData.ports];
                              newPorts[index].host = e.target.value;
                              setFormData({...formData, ports: newPorts});
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton onClick={() => handleArrayFieldRemove('ports', index)}>
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleArrayFieldAdd('ports')}
                      sx={{ mb: 2 }}
                    >
                      Add Port
                    </Button>

                    {/* Run Commands */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Run Commands
                      <Tooltip title="Commands to run during container build">
                        <IconButton size="small">
                          <Help fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    {formData.runCommands.map((cmd, index) => (
                      <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                        <Grid item xs={10}>
                          <TextField
                            fullWidth
                            label="Command"
                            value={cmd.command}
                            onChange={(e) => {
                              const newCommands = [...formData.runCommands];
                              newCommands[index].command = e.target.value;
                              setFormData({...formData, runCommands: newCommands});
                            }}
                            placeholder="e.g., npm install or apt-get update"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton 
                            onClick={() => handleArrayFieldRemove('runCommands', index)}
                            disabled={formData.runCommands.length === 1}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleArrayFieldAdd('runCommands')}
                      sx={{ mb: 2 }}
                    >
                      Add Run Command
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'sticky',
                top: 24,
                maxHeight: 'calc(100vh - 200px)',
              }}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'background.paper',
                    zIndex: 1,
                    pb: 2
                  }}>
                    <Typography variant="h5">
                      Generated Dockerfile
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={downloadDockerfile}
                      disabled={!dockerfile}
                    >
                      Download Dockerfile
                    </Button>
                  </Box>
                  
                  <Box sx={{ height: 'calc(100vh - 300px)' }}>
                    <Editor
                      height="100%"
                      defaultLanguage="dockerfile"
                      value={dockerfile}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
                        minimap: { enabled: false }
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default GeneratorPage; 