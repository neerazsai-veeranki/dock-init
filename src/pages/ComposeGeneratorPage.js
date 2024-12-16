import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Download, ArrowBack, Add, Delete, Help, ExpandMore } from '@mui/icons-material';

function ComposeGeneratorPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    version: '3.8',
    services: [],
    networks: [{ name: '', driver: 'bridge' }],
    volumes: [{ name: '', driver: 'local' }]
  });

  const [composeFile, setComposeFile] = useState('');
  const [expandedService, setExpandedService] = useState(null);

  const handleArrayFieldAdd = (service, fieldName) => {
    const newServices = [...formData.services];
    const serviceIndex = newServices.findIndex(s => s === service);
    
    if (serviceIndex !== -1) {
      newServices[serviceIndex] = {
        ...service,
        [fieldName]: [...service[fieldName], getEmptyObject(fieldName)]
      };
      setFormData({ ...formData, services: newServices });
    }
  };

  const handleArrayFieldRemove = (service, fieldName, index) => {
    const newServices = [...formData.services];
    const serviceIndex = newServices.findIndex(s => s === service);
    
    if (serviceIndex !== -1) {
      newServices[serviceIndex] = {
        ...service,
        [fieldName]: service[fieldName].filter((_, i) => i !== index)
      };
      setFormData({ ...formData, services: newServices });
    }
  };

  const getEmptyObject = (fieldName) => {
    switch (fieldName) {
      case 'ports': return { host: '', container: '' };
      case 'environment': return { key: '', value: '' };
      case 'volumes': return { host: '', container: '' };
      default: return {};
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        {
          name: '',
          image: '',
          build: {
            context: '.',
            dockerfile: 'Dockerfile'
          },
          ports: [{ host: '', container: '' }],
          environment: [{ key: '', value: '' }],
          volumes: [{ host: '', container: '' }],
          depends_on: [],
          networks: [],
          restart: 'unless-stopped'
        }
      ]
    });
    setExpandedService(formData.services.length);
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
    
    if (newServices.length === 0) {
      setExpandedService(null);
    } else if (expandedService === index) {
      setExpandedService(null);
    } else if (expandedService > index) {
      setExpandedService(expandedService - 1);
    }
  };

  useEffect(() => {
    generateComposeFile();
  }, [formData]);

  const generateComposeFile = () => {
    let content = `version: "${formData.version}"\n\n`;

    // Services
    content += 'services:\n';
    formData.services.forEach(service => {
      if (service.name) {
        content += `  ${service.name}:\n`;
        if (service.image) content += `    image: ${service.image}\n`;
        
        // Build context
        if (service.build?.context) {
          content += '    build:\n';
          content += `      context: ${service.build.context}\n`;
          content += `      dockerfile: ${service.build.dockerfile}\n`;
        }

        // Ports
        if (service.ports.some(p => p.container)) {
          content += '    ports:\n';
          service.ports.forEach(port => {
            if (port.container) {
              content += `      - "${port.host || port.container}:${port.container}"\n`;
            }
          });
        }

        // Environment
        if (service.environment.some(env => env.key)) {
          content += '    environment:\n';
          service.environment.forEach(env => {
            if (env.key) {
              content += `      - ${env.key}=${env.value}\n`;
            }
          });
        }

        // Volumes
        if (service.volumes.some(vol => vol.container)) {
          content += '    volumes:\n';
          service.volumes.forEach(vol => {
            if (vol.container) {
              content += `      - ${vol.host || '.'}:${vol.container}\n`;
            }
          });
        }

        if (service.restart) {
          content += `    restart: ${service.restart}\n`;
        }

        content += '\n';
      }
    });

    // Networks
    if (formData.networks.some(net => net.name)) {
      content += 'networks:\n';
      formData.networks.forEach(net => {
        if (net.name) {
          content += `  ${net.name}:\n`;
          content += `    driver: ${net.driver}\n`;
        }
      });
    }

    // Volumes
    if (formData.volumes.some(vol => vol.name)) {
      content += '\nvolumes:\n';
      formData.volumes.forEach(vol => {
        if (vol.name) {
          content += `  ${vol.name}:\n`;
          content += `    driver: ${vol.driver}\n`;
        }
      });
    }

    setComposeFile(content);
  };

  const downloadComposeFile = () => {
    const element = document.createElement('a');
    const file = new Blob([composeFile], { type: 'text/yaml' });
    element.href = URL.createObjectURL(file);
    element.download = 'docker-compose.yml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  // Add new state for service templates
  const serviceTemplates = [
    {
      name: 'Web App',
      template: {
        name: 'web',
        image: 'node:alpine',
        build: {
          context: '.',
          dockerfile: 'Dockerfile'
        },
        ports: [{ host: '3000', container: '3000' }],
        environment: [{ key: 'NODE_ENV', value: 'production' }],
        volumes: [{ host: './app', container: '/app' }],
        depends_on: [],
        networks: ['app-network'],
        restart: 'unless-stopped'
      }
    },
    {
      name: 'Database',
      template: {
        name: 'db',
        image: 'postgres:latest',
        ports: [{ host: '5432', container: '5432' }],
        environment: [
          { key: 'POSTGRES_DB', value: 'mydb' },
          { key: 'POSTGRES_USER', value: 'user' },
          { key: 'POSTGRES_PASSWORD', value: 'password' }
        ],
        volumes: [{ host: 'db-data', container: '/var/lib/postgresql/data' }],
        networks: ['app-network'],
        restart: 'unless-stopped',
        depends_on: []
      }
    },
    {
      name: 'Cache',
      template: {
        name: 'redis',
        image: 'redis:alpine',
        ports: [{ host: '6379', container: '6379' }],
        volumes: [{ host: 'redis-data', container: '/data' }],
        environment: [],
        networks: ['app-network'],
        restart: 'unless-stopped',
        depends_on: [],
        build: { context: '.', dockerfile: 'Dockerfile' }
      }
    }
  ];

  // Add function to handle template selection
  const addServiceFromTemplate = (template) => {
    const defaultFields = {
      environment: [],
      ports: [],
      volumes: [],
      depends_on: [],
      networks: [],
      build: { context: '.', dockerfile: 'Dockerfile' }
    };

    setFormData({
      ...formData,
      services: [
        ...formData.services,
        {
          ...defaultFields,
          ...template,
          name: `${template.name}-${formData.services.length + 1}`
        }
      ]
    });
    setExpandedService(formData.services.length);
  };

  // Handle accordion expansion
  const handleAccordionChange = (serviceIndex) => (event, isExpanded) => {
    setExpandedService(isExpanded ? serviceIndex : null);
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
            {/* Left side - Scrollable configuration */}
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                pr: 2
              }}>
                <Paper sx={{ p: 3 }}>
                  {/* Project configuration */}
                  <Typography variant="h5" gutterBottom>
                    Configure Docker Compose
                  </Typography>
                  
                  <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Compose Version</InputLabel>
                      <Select
                        value={formData.version}
                        label="Compose Version"
                        onChange={(e) => setFormData({...formData, version: e.target.value})}
                      >
                        <MenuItem value="3.8">3.8</MenuItem>
                        <MenuItem value="3.7">3.7</MenuItem>
                        <MenuItem value="3.6">3.6</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="2.4">2.4</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Service Templates */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Quick Add Service Template
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {serviceTemplates.map((template, index) => (
                          <Button
                            key={index}
                            variant="outlined"
                            size="small"
                            onClick={() => addServiceFromTemplate(template.template)}
                            startIcon={<Add />}
                          >
                            {template.name}
                          </Button>
                        ))}
                      </Box>
                    </Paper>

                    {/* Services List */}
                    {formData.services.length === 0 ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 2,
                        my: 4,
                        p: 4,
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}>
                        <Typography variant="h6" color="textSecondary">
                          No services configured
                        </Typography>
                        <Typography color="textSecondary" align="center">
                          Add a service using the templates above or create a custom service
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={addService}
                          color="primary"
                        >
                          Add Custom Service
                        </Button>
                      </Box>
                    ) : (
                      <>
                        {formData.services.map((service, serviceIndex) => (
                          <Accordion
                            key={serviceIndex}
                            expanded={expandedService === serviceIndex}
                            onChange={handleAccordionChange(serviceIndex)}
                            sx={{ mb: 2 }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMore />}
                              sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                width: '100%',
                                pr: 2
                              }}>
                                <Typography>
                                  {service.name || `Service ${serviceIndex + 1}`}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeService(serviceIndex);
                                  }}
                                  sx={{ ml: 2 }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    label="Service Name"
                                    value={service.name}
                                    onChange={(e) => {
                                      const newServices = [...formData.services];
                                      newServices[serviceIndex] = { ...service, name: e.target.value };
                                      setFormData({ ...formData, services: newServices });
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    label="Image"
                                    value={service.image}
                                    onChange={(e) => {
                                      const newServices = [...formData.services];
                                      newServices[serviceIndex] = { ...service, image: e.target.value };
                                      setFormData({ ...formData, services: newServices });
                                    }}
                                  />
                                </Grid>
                              </Grid>

                              {/* Build Configuration */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Build Configuration
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label="Build Context"
                                      value={service.build?.context || ''}
                                      onChange={(e) => {
                                        const newServices = [...formData.services];
                                        newServices[serviceIndex] = {
                                          ...service,
                                          build: { ...service.build, context: e.target.value }
                                        };
                                        setFormData({ ...formData, services: newServices });
                                      }}
                                      placeholder="./"
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label="Dockerfile Path"
                                      value={service.build?.dockerfile || ''}
                                      onChange={(e) => {
                                        const newServices = [...formData.services];
                                        newServices[serviceIndex] = {
                                          ...service,
                                          build: { ...service.build, dockerfile: e.target.value }
                                        };
                                        setFormData({ ...formData, services: newServices });
                                      }}
                                      placeholder="Dockerfile"
                                    />
                                  </Grid>
                                </Grid>
                              </Box>

                              {/* Ports Configuration */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Ports
                                  <Tooltip title="Map container ports to host ports">
                                    <IconButton size="small">
                                      <Help fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                {service.ports.map((port, index) => (
                                  <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        label="Host Port"
                                        value={port.host}
                                        onChange={(e) => {
                                          const newServices = [...formData.services];
                                          newServices[serviceIndex].ports[index].host = e.target.value;
                                          setFormData({ ...formData, services: newServices });
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        label="Container Port"
                                        value={port.container}
                                        onChange={(e) => {
                                          const newServices = [...formData.services];
                                          newServices[serviceIndex].ports[index].container = e.target.value;
                                          setFormData({ ...formData, services: newServices });
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <IconButton 
                                        onClick={() => handleArrayFieldRemove(service, 'ports', index)}
                                        disabled={service.ports.length === 1}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                ))}
                                <Button
                                  startIcon={<Add />}
                                  onClick={() => handleArrayFieldAdd(service, 'ports')}
                                  size="small"
                                >
                                  Add Port
                                </Button>
                              </Box>

                              {/* Environment Variables */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Environment Variables
                                  <Tooltip title="Set environment variables for the container">
                                    <IconButton size="small">
                                      <Help fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                {service.environment.map((env, index) => (
                                  <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        label="Key"
                                        value={env.key}
                                        onChange={(e) => {
                                          const newServices = [...formData.services];
                                          newServices[serviceIndex].environment[index].key = e.target.value;
                                          setFormData({ ...formData, services: newServices });
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        label="Value"
                                        value={env.value}
                                        onChange={(e) => {
                                          const newServices = [...formData.services];
                                          newServices[serviceIndex].environment[index].value = e.target.value;
                                          setFormData({ ...formData, services: newServices });
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <IconButton 
                                        onClick={() => handleArrayFieldRemove(service, 'environment', index)}
                                        disabled={service.environment.length === 1}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                ))}
                                <Button
                                  startIcon={<Add />}
                                  onClick={() => handleArrayFieldAdd(service, 'environment')}
                                  size="small"
                                >
                                  Add Environment Variable
                                </Button>
                              </Box>

                              {/* Volumes */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Volumes
                                  <Tooltip title="Configure volume mappings">
                                    <IconButton size="small">
                                      <Help fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                {service.volumes.map((volume, index) => (
                                  <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        label="Host Path"
                                        value={volume.host}
                                        onChange={(e) => {
                                          const newServices = [...formData.services];
                                          newServices[serviceIndex].volumes[index].host = e.target.value;
                                          setFormData({ ...formData, services: newServices });
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={5}>
                                      <TextField
                                        fullWidth
                                        label="Container Path"
                                        value={volume.container}
                                        onChange={(e) => {
                                          const newServices = [...formData.services];
                                          newServices[serviceIndex].volumes[index].container = e.target.value;
                                          setFormData({ ...formData, services: newServices });
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <IconButton 
                                        onClick={() => handleArrayFieldRemove(service, 'volumes', index)}
                                        disabled={service.volumes.length === 1}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                ))}
                                <Button
                                  startIcon={<Add />}
                                  onClick={() => handleArrayFieldAdd(service, 'volumes')}
                                  size="small"
                                >
                                  Add Volume
                                </Button>
                              </Box>

                              {/* Networks */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Networks
                                </Typography>
                                <FormControl fullWidth>
                                  <InputLabel>Restart Policy</InputLabel>
                                  <Select
                                    value={service.restart || 'no'}
                                    label="Restart Policy"
                                    onChange={(e) => {
                                      const newServices = [...formData.services];
                                      newServices[serviceIndex] = { ...service, restart: e.target.value };
                                      setFormData({ ...formData, services: newServices });
                                    }}
                                  >
                                    <MenuItem value="no">No</MenuItem>
                                    <MenuItem value="always">Always</MenuItem>
                                    <MenuItem value="on-failure">On Failure</MenuItem>
                                    <MenuItem value="unless-stopped">Unless Stopped</MenuItem>
                                  </Select>
                                </FormControl>
                              </Box>

                              {/* Depends On */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Depends On
                                  <Tooltip title="Specify service dependencies">
                                    <IconButton size="small">
                                      <Help fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                <FormControl fullWidth>
                                  <Select
                                    multiple
                                    value={service.depends_on || []}
                                    onChange={(e) => {
                                      const newServices = [...formData.services];
                                      newServices[serviceIndex] = { ...service, depends_on: e.target.value };
                                      setFormData({ ...formData, services: newServices });
                                    }}
                                    renderValue={(selected) => selected.join(', ')}
                                  >
                                    {formData.services
                                      .filter((s, idx) => idx !== serviceIndex && s.name)
                                      .map((s) => (
                                        <MenuItem key={s.name} value={s.name}>
                                          {s.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Box>

                              {/* Additional Settings */}
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Additional Settings
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={service.privileged || false}
                                          onChange={(e) => {
                                            const newServices = [...formData.services];
                                            newServices[serviceIndex] = { 
                                              ...service, 
                                              privileged: e.target.checked 
                                            };
                                            setFormData({ ...formData, services: newServices });
                                          }}
                                        />
                                      }
                                      label="Privileged Mode"
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={addService}
                            color="primary"
                          >
                            Add Another Service
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Right side - Fixed editor */}
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
                      Generated Docker Compose
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={downloadComposeFile}
                      disabled={!composeFile}
                    >
                      Download docker-compose.yml
                    </Button>
                  </Box>
                  
                  <Box sx={{ height: 'calc(100vh - 300px)' }}>
                    <Editor
                      height="100%"
                      defaultLanguage="yaml"
                      value={composeFile}
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

export default ComposeGeneratorPage; 