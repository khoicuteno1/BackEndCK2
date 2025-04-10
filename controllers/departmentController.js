
const fs = require('fs'); // Để đọc file SSL
const mysql = require('mysql2/promise'); // Import mysql2 để kết nối MySQL
const connection = mysql.createPool({
  host: "mysql-3d6d342f-huynhkhoi2002123-e6a2.k.aivencloud.com", // Địa chỉ MySQL của bạn
  user: "avnadmin", // Tên người dùng của MySQL

  password:"AVNS_8pbTDsiPb0wb3sZx_YB", // Mật khẩu người dùng

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

  try {
    // Kiểm tra xem có course nào thuộc department này không
    const [courseCheck] = await connection.query(
      'SELECT COUNT(*) AS count FROM courses WHERE departmentId = ?',
      [id]
    );

    if (courseCheck[0].count > 0) {
      return res.status(400).json({
        message: 'Không thể xóa phòng ban này vì vẫn còn khóa học trực thuộc.'
      });
    }

    // Nếu không có course -> cho phép xóa department
    const [result] = await connection.query(
      'DELETE FROM departments WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại.' });
    }

    res.status(200).json({ message: 'Xóa phòng ban thành công.' });
  } catch (err) {
    console.error('Lỗi khi xóa phòng ban:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
};


module.exports = {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
};
