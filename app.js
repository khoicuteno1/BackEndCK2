const express = require('express');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const departmentController = require('./routes/departmentRoutes');
const enrollmentController = require('./routes/enrollmentRoutes');

const mysql = require('mysql2/promise'); // Import mysql2 để kết nối MySQL


const cors = require('cors');
require('dotenv').config(); // Nạp biến môi trường từ .env

const app = express();
const port = 3030;


// Cấu hình middleware
app.use(cors());
app.use(express.json());
app.use('/api', studentRoutes);
app.use('/api', courseRoutes);
app.use('/api', departmentController);
app.use('/api', enrollmentController);

// Lắng nghe server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

