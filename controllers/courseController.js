const Course = require('../models/Course');

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
