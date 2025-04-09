const express = require('express');
const { getAllCourses, addCourse, updateCourse, deleteCourse } = require('../controllers/courseController');

const router = express.Router();

// Lấy tất cả khóa học
router.get('/courses', getAllCourses);

// Thêm khóa học mới
router.post('/courses', addCourse);

// Cập nhật thông tin khóa học
router.put('/courses/:id', updateCourse);

// Xóa khóa học
router.delete('/courses/:id', deleteCourse);

module.exports = router;
