const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Get port from environment variable or use 8080
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 