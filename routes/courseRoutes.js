// const express = require('express');
// const {
//   createCourse,
//   getMyCourses,
//   updateCourse,
//   deleteCourse
// } = require('../controllers/courseController');
// const { protect, instructorOnly } = require('../middleware/auth');

// const router = express.Router();

// // Instructor routes
// router.post('/', protect, instructorOnly, createCourse);
// router.get('/mine', protect, instructorOnly, getMyCourses);
// router.put('/:id', protect, instructorOnly, updateCourse);
// router.delete('/:id', protect, instructorOnly, deleteCourse);

// module.exports = router;
const express = require('express');
const {
  createCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getAllCourses,
  getEnrolledCourses,
  getCourseRecommendationsAPI
} = require('../controllers/courseController');
const { protect, instructorOnly, studentOnly } = require('../middleware/auth');


const router = express.Router();

// Instructor routes
router.post('/', protect, instructorOnly, createCourse);
router.get('/mine', protect, instructorOnly, getMyCourses);
router.put('/:id', protect, instructorOnly, updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);

// Student routes
router.get('/', protect, getAllCourses); // View all courses
router.post('/enroll/:id', protect, enrollCourse); // Enroll in a course
router.get('/enrolled', protect, getEnrolledCourses); // View enrolled courses

// Route to get course recommendations
router.post('/recommend', protect, studentOnly ,getCourseRecommendationsAPI);

module.exports = router;
