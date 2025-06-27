
# A_Maga Backend – Online Learning Platform

## 📌 Overview

A_Maga is an online learning backend built with Node.js, Express, and MongoDB. It supports:
- JWT-based authentication
- Role-based access (student/instructor)
- Course management (CRUD)
- AI-powered course recommendations via Google Gemini

---

## ⚙️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** (via Mongoose)
- **JWT Authentication**
- **Google Gemini API** (@google/genai SDK)

---

## 📁 Folder Structure

```
/A_Maga_Backend
├── config/               # DB connection
├── controllers/          # Logic for routes
├── middleware/           # Auth & role checks
├── models/               # Mongoose schemas
├── routes/               # Route definitions
├── utils/                # Gemini + parsing
├── .env
├── server.js
```

---

## 🔐 Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
GOOGLE_GENAI_API_KEY=<your-gemini-api-key>
```

---

## 🚀 Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or
node server.js
```

---

## 🛰 Deployment

Use Render, Railway, or Heroku. Set your environment variables and Mongo URI.

---

## 🔧 API Endpoints

### ✅ Auth

| Method | Endpoint            | Description    |
|--------|---------------------|----------------|
| POST   | /api/auth/register  | Register user  |
| POST   | /api/auth/login     | Login user     |

### ✅ Courses

| Method | Endpoint                     | Role        |
|--------|------------------------------|-------------|
| GET    | /api/courses/                | Student     |
| POST   | /api/courses/                | Instructor  |
| GET    | /api/courses/mine            | Instructor  |
| PUT    | /api/courses/:id             | Instructor  |
| DELETE | /api/courses/:id             | Instructor  |
| POST   | /api/courses/enroll/:id      | Student     |
| GET    | /api/courses/enrolled        | Student     |
| POST   | /api/courses/recommend       | Student     |

All routes (except auth) require JWT: `Authorization: Bearer <token>`

---

## 🤖 Gemini AI Integration

- Prompt format includes summary + max 5 courses.
- Courses parsed and matched to MongoDB entries by title/description.

### Example Request:

```json
{
  "query": "I want to become a software engineer, what should I learn?"
}
```

### Example Response:

```json
{
  "geminiResponse": "Start with programming basics...",
  "availableCourses": [
    {
      "title": "JavaScript Basics",
      "description": "Learn the fundamentals of JS"
    }
  ]
}
```

---

## 🧠 Database Design

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: 'student' | 'instructor'
}
```

### Course

```js
{
  title: String,
  description: String,
  content: String,
  instructor: ObjectId,
  enrolledStudents: [ObjectId]
}
```

---

## 🧪 Testing with Postman

1. Register & login
2. Use token for all `/courses` routes
3. Test: create, enroll, and get recommendations

---

## ✅ Role Middleware Example

```js
if (req.user.role !== 'instructor') {
  return res.status(403).json({ message: 'Instructors only' });
}
```

---

## ✅ Done

- Backend completed ✅
- Role-based system ✅
- Gemini integration ✅
- Ready for frontend or deployment!
