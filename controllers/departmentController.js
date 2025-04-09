
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
// Lấy danh sách tất cả các phòng ban
const getAllDepartments = async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM departments');
    res.status(200).json(results);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách phòng ban:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Thêm phòng ban mới
const addDepartment = async (req, res) => {
  const { departmentName, description } = req.body;
  const query = 'INSERT INTO departments (departmentName, description) VALUES (?, ?)';
  try {
    const [results] = await connection.query(query, [departmentName, description]);
    res.status(201).json({ id: results.insertId, departmentName, description });
  } catch (err) {
    console.error('Lỗi khi thêm phòng ban:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Cập nhật thông tin phòng ban
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { departmentName, description } = req.body;
  const query = 'UPDATE departments SET departmentName = ?, description = ? WHERE id = ?';
  try {
    const [results] = await connection.query(query, [departmentName, description, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ id, departmentName, description });
  } catch (err) {
    console.error('Lỗi khi cập nhật phòng ban:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Xóa phòng ban
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM departments WHERE id = ?';
  try {
    const [results] = await connection.query(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Lỗi khi xóa phòng ban:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
};
