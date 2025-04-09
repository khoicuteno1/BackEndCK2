const fs = require('fs'); // Để đọc file SSL
const mysql = require('mysql2/promise'); // Import mysql2 để kết nối MySQL
const connection = mysql.createPool({
  host: "mysql-3d6d342f-huynhkhoi2002123-e6a2.k.aivencloud.com", // Địa chỉ MySQL của bạn
  user: "avnadmin", // Tên người dùng của MySQL
  password: "AVNS_8pbTDsiPb0wb3sZx_YB", // Mật khẩu người dùng
  database: "defaultdb", // Tên cơ sở dữ liệu
  port: 20053, // Cổng của MySQL
  ssl: {
    ca: fs.readFileSync('./certs/ca.pem').toString(), // Đọc file SSL từ thư mục
  }
});

// Lấy danh sách tất cả khóa học và thông tin liên quan
const getAllCourses = async (req, res) => {
  const query = `
    SELECT c.id, c.courseName, c.credits, c.semester, c.departmentId, d.departmentName, e.studentId, e.enrollDate
    FROM courses c
    LEFT JOIN departments d ON c.departmentId = d.id
    LEFT JOIN enrollments e ON c.id = e.courseId
  `;
  
  try {
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khóa học:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Thêm khóa học
const addCourse = async (req, res) => {
  const { courseName, description, credits, semester, departmentId } = req.body;
  const query = 'INSERT INTO courses (courseName, credits, semester, departmentId) VALUES (?, ?, ?, ?, ?)';
  
  try {
    const [results] = await connection.query(query, [courseName, description, credits, semester, departmentId]);
    res.status(201).json({
      id: results.insertId,
      courseName,
      description,
      credits,
      semester,
      departmentId
    });
  } catch (err) {
    console.error('Lỗi khi thêm khóa học:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Xóa khóa học
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM courses WHERE id = ?';

  try {
    const [results] = await connection.query(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Lỗi khi xóa khóa học:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Sửa khóa học
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseName, description, credits, semester, departmentId } = req.body;

  const query = 'UPDATE courses SET courseName = ?, description = ?, credits = ?, semester = ?, departmentId = ? WHERE id = ?';
  
  try {
    const [results] = await connection.query(query, [courseName, description, credits, semester, departmentId, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ id, courseName, description, credits, semester, departmentId });
  } catch (err) {
    console.error('Lỗi khi cập nhật khóa học:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse
};
