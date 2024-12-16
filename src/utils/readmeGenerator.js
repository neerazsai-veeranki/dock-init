export const generateReadme = (projectName, dockerfile) => {
  return `# ${projectName}

## Docker Setup

This project includes a Dockerfile for containerization. Follow these steps to build and run the container:

1. Build the Docker image:
\`\`\`bash
docker build -t ${projectName.toLowerCase()} .
\`\`\`

2. Run the container:
\`\`\`bash
docker run -p 3000:3000 ${projectName.toLowerCase()}
\`\`\`

## Dockerfile Contents

\`\`\`dockerfile
${dockerfile}
\`\`\`

## Additional Information

- The application runs on port 3000 by default
- The container uses Node.js as the base image
- All dependencies are installed during the build process
`;
}; 