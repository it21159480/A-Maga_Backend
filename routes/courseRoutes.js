const express = require('express');
const {
  createCourse,
  getMyCourses,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/auth');

const router = express.Router();

// Instructor routes
router.post('/', protect, instructorOnly, createCourse);
router.get('/mine', protect, instructorOnly, getMyCourses);
router.put('/:id', protect, instructorOnly, updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);

module.exports = router;
