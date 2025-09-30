# StackIt Backend - Q&A Forum Platform

A minimal Q&A forum backend built with Express.js and MongoDB for the Odoo Hackathon 2025.

## 🚀 Features

### 🔒 User Roles
- **Guest**: View all questions and answers
- **User**: Register, log in, post questions and answers, vote
- **Admin**: Moderate content

### 🎯 Core Features
- **Authentication** using JWT
- **Question Management** with tags and search
- **Answer System** with acceptance functionality
- **Voting System** for questions and answers
- **Notification System** (backend support)
- **Reputation System**

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Question.js
│   ├── Answer.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── questionRoutes.js
│   ├── answerRoutes.js
│   └── voteRoutes.js
├── controllers/
│   ├── authController.js
│   ├── questionController.js
│   ├── answerController.js
│   └── voteController.js
├── middleware/
│   └── authMiddleware.js
├── server.js
├── package.json
└── env.example
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation)
- npm or yarn

### 1. Clone and Install Dependencies
```bash
# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env with your configuration
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
MONGO_URI=mongodb://localhost:27017/stackit
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# Start MongoDB service (Ubuntu/Debian)
sudo systemctl start mongod

# Or start MongoDB manually
mongod
```

### 4. Run the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Question Endpoints

#### Get All Questions
```http
GET /api/questions?page=1&limit=10&tag=javascript&search=react&sort=newest
```

#### Get Single Question
```http
GET /api/questions/:id
```

#### Create Question
```http
POST /api/questions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "How to implement authentication in React?",
  "description": "I'm building a React app and need help with JWT authentication...",
  "tags": ["react", "authentication", "jwt"]
}
```

#### Update Question
```http
PUT /api/questions/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "tags": ["updated", "tags"]
}
```

#### Delete Question
```http
DELETE /api/questions/:id
Authorization: Bearer <jwt_token>
```

### Answer Endpoints

#### Get Answers for Question
```http
GET /api/questions/:id/answers?page=1&limit=10&sort=votes
```

#### Post Answer
```http
POST /api/questions/:id/answers
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Here's how you can implement authentication in React..."
}
```

#### Accept Answer
```http
PATCH /api/answers/:id/accept
Authorization: Bearer <jwt_token>
```

#### Update Answer
```http
PUT /api/answers/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Updated answer content..."
}
```

#### Delete Answer
```http
DELETE /api/answers/:id
Authorization: Bearer <jwt_token>
```

### Voting Endpoints

#### Vote on Question
```http
POST /api/questions/:id/vote
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "voteType": "upvote"
}
```

#### Vote on Answer
```http
POST /api/answers/:id/vote
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "voteType": "upvote"
}
```

#### Remove Vote
```http
DELETE /api/votes/question/:id/vote?type=question
Authorization: Bearer <jwt_token>
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/stackit` |
| `NODE_ENV` | Environment mode | `development` |

## 🧪 Testing with Postman

### 1. Health Check
```http
GET http://localhost:5000/health
```

### 2. Register a User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 4. Create a Question (with token)
```http
POST http://localhost:5000/api/questions
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "title": "What is the best way to learn Node.js?",
  "description": "I'm a beginner and want to learn Node.js. What resources do you recommend?",
  "tags": ["nodejs", "learning", "beginner"]
}
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- Role-based access control

## 📊 Database Schema

### User
- username, email, password
- role (guest/user/admin)
- reputation, bio, avatar
- timestamps

### Question
- title, description, tags
- author (ref: User)
- votes (upvotes/downvotes arrays)
- views, isClosed, isDeleted
- acceptedAnswer (ref: Answer)

### Answer
- content, question (ref: Question)
- author (ref: User)
- votes (upvotes/downvotes arrays)
- isAccepted, isDeleted

### Notification
- recipient, sender (ref: User)
- type, title, message
- relatedQuestion, relatedAnswer
- isRead, isDeleted

## 🎯 Next Steps

1. **Frontend Integration**: Connect with React/Vue frontend
2. **Real-time Features**: Add WebSocket support
3. **File Upload**: Implement image upload for avatars
4. **Search Enhancement**: Add Elasticsearch integration
5. **Rate Limiting**: Implement API rate limiting
6. **Testing**: Add unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your hackathon project!

---

---

## 🧾 Odoo Hackathon 2025 – Team Info

**🧠 Problem Statement Chosen:**  
🔹 **Problem Statement 2 – StackIt: A Minimal Q&A Forum**

**👥 Team Members:**

| Name             | Role               | Gmail                        |
|------------------|--------------------|------------------------------|
| Aravind          | Team Lead / Backend| mamidalaaravind40@gmail.com               |
| Chandrashekar    | Backend Developer  | chandrashekhar7215@mail.com             |
| Anjali           | Frontend Developer | anjalikoppula767@gmail.com             |
| Shriya           | Frontend Developer | shriyavemula823@gmail.com             |

**🧑‍🏫 Mentor Access (as per instructions):**
- GitHub Username: [@omra-odoo](https://github.com/omra-odoo)
- Email: omra@odoo.com

---

**Happy Hacking! 🚀** 