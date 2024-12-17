# Use Node.js slim image as base
FROM node:18-slim

# Set working directory in container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable for port
ENV PORT=8080

# Inform Docker about the port the app will use
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]