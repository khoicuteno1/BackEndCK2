const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

// CRUD routes cho Enrollment
router.get("/enrollments", enrollmentController.getAllEnrollments);
router.post("/enrollments", enrollmentController.addEnrollment);
router.put("/enrollments/:id", enrollmentController.updateEnrollment);
router.delete("/enrollments/:id", enrollmentController.deleteEnrollment);

module.exports = router;
