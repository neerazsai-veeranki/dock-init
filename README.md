# DOCK-init

DOCK-init is a modern web application that simplifies the process of creating Docker configurations. It provides an intuitive interface for generating both Dockerfiles and Docker Compose files with best practices and customizable options.

## Features

- 🚀 Easy-to-use interface for generating Dockerfiles
- 🔄 Real-time Docker Compose configuration
- 📝 Multiple service template support
- 🎨 Material UI-based modern design
- 💾 Instant file downloads
- 🔧 Customizable configurations
- 📱 Responsive design for all devices

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (version 14 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
git clone https://github.com/neerazsai-veeranki/dock-init.git
cd dock-init

2. Install dependencies:
npm install

3. Start the development server:
npm start

The application will be available at http://localhost:3000

## Dependencies

Core dependencies include:
- @emotion/react: ^11.14.0
- @emotion/styled: ^11.14.0
- @monaco-editor/react: ^4.6.0
- @mui/icons-material: ^5.16.11
- @mui/material: ^5.16.11
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.28.0

## Usage Guide

### Generating a Dockerfile

1. Click "Generate Dockerfile" on the landing page
2. Configure your settings:
   - Choose base image
   - Set working directory
   - Add environment variables
   - Configure ports
   - Add run commands
3. Preview the generated Dockerfile
4. Download when ready

### Generating Docker Compose

1. Click "Generate Docker Compose" on the landing page
2. Add services:
   - Use pre-built templates or create custom services
   - Configure service-specific settings
   - Add environment variables and volumes
3. Preview the generated docker-compose.yml
4. Download when ready

## Project Structure

dock-init/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── LandingPage.js
│   │   ├── GeneratorPage.js
│   │   └── ComposeGeneratorPage.js
│   ├── App.js
│   ├── index.js
│   └── theme.js
└── package.json

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Neerazsai Veeranki
GitHub: @neerazsai-veeranki

## Acknowledgments

- Material-UI team for the amazing component library
- Monaco Editor for the code editor component
- React team for the fantastic framework

Made with ❤️ by Neerazsai Veeranki