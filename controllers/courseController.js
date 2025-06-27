const Course = require('../models/Course');
const { getCourseRecommendations, filterAvailableCourses, parseGeminiResponse } = require('../utils/gpthelper');

exports.createCourse = async (req, res) => {
  const { title, description, content } = req.body;

  try {
    const course = new Course({
      title,
      description,
      content,
      instructor: req.user._id
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, content } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.content = content || course.content;

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user._id
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Enroll a student in a course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if the student is already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Enroll the student
    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.status(200).json({
      message: 'Successfully enrolled in the course',
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        enrolledStudents: course.enrolledStudents,
        content: course.content
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available courses (for students)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get courses a student is enrolled in
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user._id });
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No enrolled courses found' });
    }
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve enrolled courses', error: err.message });
  }
};


// Controller to get hybrid course recommendations
exports.getCourseRecommendationsAPI = async (req, res) => {
  const { query } = req.body; // Student's query (e.g., "What courses should I follow to become a software engineer?")

  try {
    // Step 1: Get Gemini response (raw recommendation)
    const geminiResponse = await getCourseRecommendations(query);

    // Step 2: Parse the Gemini response with word and course limits
    const parsedResponse = parseGeminiResponse(geminiResponse, 100, 5); // 100 words max and 5 courses

    // Step 3: Filter the Gemini response against available courses
    const availableCourses = await filterAvailableCourses(parsedResponse.courses);

    // Return both GPT-3 response and filtered courses to the client
    res.status(200).json({
      message: 'Here are your course recommendations:',
      gptResponse: geminiResponse, // Display the raw GPT-3 response
      availableCourses: availableCourses // Display the filtered available courses
    });
  } catch (err) {
    if (err.message === 'API request limit exceeded') {
      return res.status(429).json({ message: 'API request limit reached. Please try again later.' });
    }
    res.status(500).json({ message: err.message });
  }
};

