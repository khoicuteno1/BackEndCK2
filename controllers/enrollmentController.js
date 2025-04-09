
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

// Lấy danh sách tất cả các enrollment
// Lấy danh sách tất cả các enrollment
const getAllEnrollments = async (req, res) => {
  try {
    const query = `
      SELECT e.id, e.studentId, e.courseId, e.semester, e.enrollDate, e.grade, e.createdAt, e.updatedAt,
             s.firstName, s.lastName, c.courseName
      FROM enrollments e
      JOIN students s ON e.studentId = s.id
      JOIN courses c ON e.courseId = c.id
    `;

    // Sử dụng async/await để thực hiện truy vấn
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ghi danh:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// Thêm một enrollment mới
const addEnrollment = async (req, res) => {
  const { studentId, courseId, semester, enrollDate } = req.body;

  try {
    const query = `
      INSERT INTO Enrollments (studentId, courseId, semester, enrollDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [studentId, courseId, semester, enrollDate];

    // Sử dụng async/await để thực hiện truy vấn
    const [result] = await connection.query(query, values);
    res.status(201).json({ message: 'Thêm ghi danh thành công', enrollmentId: result.insertId });
  } catch (error) {
    console.error('Lỗi khi thêm ghi danh:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
// Cập nhật thông tin enrollment
const updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { grade } = req.body;

  try {
    const query = `
      UPDATE Enrollments
      SET grade = ?, updatedAt = NOW()
      WHERE id = ?
    `;
    const values = [grade, id];

    // Sử dụng async/await để thực hiện truy vấn
    const [result] = await connection.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ghi danh không tồn tại' });
    }
    res.status(200).json({ message: 'Cập nhật ghi danh thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật ghi danh:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};  

// Xóa enrollment
const deleteEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    // Sử dụng async/await để thực hiện truy vấn
    const [result] = await connection.query('DELETE FROM Enrollments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ghi danh không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa ghi danh thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa ghi danh:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
module.exports = {
  getAllEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment
};
