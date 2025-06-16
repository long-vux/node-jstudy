// server.js
const express = require('express');
const app = express();
const port = 3000;

// Cấu hình route cơ bản
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Lắng nghe yêu cầu ở cổng 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
