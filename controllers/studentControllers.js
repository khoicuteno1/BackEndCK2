const fs = require('fs'); // Để đọc file SSL
const mysql = require('mysql2/promise'); // Import mysql2 để kết nối MySQL
const connection = mysql.createPool({
  host: "mysql-3d6d342f-huynhkhoi2002123-e6a2.k.aivencloud.com", // Địa chỉ MySQL của bạn
  user: "avnadmin", // Tên người dùng của MySQL
  password: process.env.DB_PASSWORD, // Mật khẩu người dùng
  database: "defaultdb", // Tên cơ sở dữ liệu
  port: 20053, // Cổng của MySQL
  ssl: {
    ca: fs.readFileSync('./certs/ca.pem').toString(), // Đọc file SSL từ thư mục
  }
});
const getAllStudents = async (req, res) => {
  try {
    // Sử dụng async/await để thực hiện truy vấn
    const [results] = await connection.query('SELECT * FROM students');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching students:', error); // In chi tiết lỗi
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,  // Trả về thông báo lỗi chi tiết
      stack: error.stack     // Trả về stack trace giúp xác định vị trí lỗi
    });
  }
};
// Thêm sinh viên mới
const addStudent = async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, address, phoneNumber, email } = req.body;

  try {
    const query = 'INSERT INTO students (firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
    const values = [firstName, lastName, dateOfBirth, gender, address, phoneNumber, email];

    const [result] = await connection.query(query, values);
    res.status(201).json({ message: 'Thêm sinh viên thành công', studentId: result.insertId });
  } catch (error) {
    console.error('Lỗi khi thêm sinh viên:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa sinh viên
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await connection.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa sinh viên thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa sinh viên:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật sinh viên
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dateOfBirth, gender, address, phoneNumber, email } = req.body;

  try {
    const query = 'UPDATE students SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, address = ?, phoneNumber = ?, email = ?, updatedAt = NOW() WHERE id = ?';
    const values = [firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, id];

    const [result] = await connection.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
    res.status(200).json({ message: 'Cập nhật sinh viên thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật sinh viên:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  deleteStudent,
  updateStudent
};