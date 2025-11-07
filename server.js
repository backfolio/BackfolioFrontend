const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the current directory (where dist files are deployed)
app.use(express.static('.'));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});