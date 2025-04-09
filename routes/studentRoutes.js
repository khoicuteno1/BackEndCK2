const express = require('express');
const router = express.Router();
const { getAllStudents, addStudent, deleteStudent, updateStudent } = require('../controllers/studentControllers');

router.get('/students', getAllStudents);
router.post('/students', addStudent);
router.delete('/students/:id', deleteStudent);
router.put('/students/:id', updateStudent);

module.exports = router;
