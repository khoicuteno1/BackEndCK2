const express = require('express');
const { getAllDepartments, addDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');

const router = express.Router();

// Lấy tất cả departments
router.get('/departments', getAllDepartments);

// Thêm department mới
router.post('/departments', addDepartment);

// Cập nhật thông tin department
router.put('/departments/:id', updateDepartment);

// Xóa department
router.delete('/departments/:id', deleteDepartment);

module.exports = router;
