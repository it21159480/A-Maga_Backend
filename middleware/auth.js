const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check role
exports.instructorOnly = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied: Instructors only' });
  }
  next();
};

exports.studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Students only' }); // Access denied for non-students
  }
  next(); // Allow the request to proceed if the user is a student
};