const mongoose = require('mongoose');
const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stackit');
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create test users
    const user1 = new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      reputation: 150,
      bio: 'Full-stack developer passionate about React and Node.js'
    });

    const user2 = new User({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: 'password123',
      reputation: 200,
      bio: 'Senior developer specializing in Python and machine learning'
    });

    const user3 = new User({
      username: 'admin',
      email: 'admin@stackit.com',
      password: 'admin123',
      role: 'admin',
      reputation: 500,
      bio: 'StackIt platform administrator'
    });

    await user1.save();
    await user2.save();
    await user3.save();
    console.log('👥 Created test users');

    // Create test questions
    const question1 = new Question({
      title: 'How to implement authentication in React with JWT?',
      description: `I'm building a React application and need to implement user authentication using JWT tokens. 

I've tried using localStorage to store the token, but I'm concerned about security. What's the best practice for:

1. Storing JWT tokens securely
2. Handling token expiration
3. Implementing protected routes
4. Refreshing tokens automatically

I'm using React Router v6 and axios for API calls. Any code examples would be greatly appreciated!`,
      tags: ['react', 'javascript', 'authentication', 'jwt'],
      author: user1._id,
      views: 45,
      votes: {
        upvotes: [user2._id],
        downvotes: []
      }
    });

    const question2 = new Question({
      title: 'Best practices for MongoDB schema design',
      description: `I'm designing a database schema for an e-commerce application using MongoDB. 

I need to store:
- User profiles
- Product catalog
- Orders and order history
- Reviews and ratings

What are the best practices for:
1. Embedding vs referencing documents
2. Indexing strategies
3. Handling relationships
4. Performance optimization

I'm using Mongoose as ODM. Thanks in advance!`,
      tags: ['mongodb', 'database', 'schema-design', 'mongoose'],
      author: user2._id,
      views: 32,
      votes: {
        upvotes: [user1._id, user3._id],
        downvotes: []
      }
    });

    const question3 = new Question({
      title: 'Deploying Node.js app to production with Docker',
      description: `I have a Node.js/Express application that I want to deploy to production using Docker.

Current setup:
- Node.js 18
- Express.js
- MongoDB
- Redis for caching

Questions:
1. How to create an optimized Dockerfile?
2. Best practices for environment variables
3. Setting up Docker Compose for production
4. Health checks and monitoring
5. SSL/TLS configuration

Any deployment tips would be helpful!`,
      tags: ['nodejs', 'docker', 'deployment', 'express'],
      author: user1._id,
      views: 28,
      votes: {
        upvotes: [],
        downvotes: []
      }
    });

    await question1.save();
    await question2.save();
    await question3.save();
    console.log('❓ Created test questions');

    // Create test answers
    const answer1 = new Answer({
      content: `Great question! Here's a comprehensive approach to JWT authentication in React:

## 1. Secure Token Storage
Instead of localStorage, use httpOnly cookies or memory storage:
\`\`\`javascript
// Using memory storage (cleared on page refresh)
const [token, setToken] = useState(null);

// Or use httpOnly cookies set by your backend
\`\`\`

## 2. Token Expiration Handling
\`\`\`javascript
const checkTokenExpiration = (token) => {
  const decoded = jwt_decode(token);
  return decoded.exp * 1000 < Date.now();
};
\`\`\`

## 3. Protected Routes
\`\`\`javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
\`\`\`

## 4. Automatic Token Refresh
Implement a refresh token mechanism with axios interceptors.

This approach is much more secure than localStorage!`,
      question: question1._id,
      author: user2._id,
      votes: {
        upvotes: [user1._id, user3._id],
        downvotes: []
      },
      isAccepted: true
    });

    const answer2 = new Answer({
      content: `For MongoDB schema design in e-commerce, here are my recommendations:

## Embedding vs Referencing
- **Embed**: User addresses, product variants, order items
- **Reference**: Users, Products, Orders (main entities)

## Example Schema:
\`\`\`javascript
// User (referenced)
{
  _id: ObjectId,
  username: String,
  email: String,
  addresses: [{
    street: String,
    city: String,
    country: String
  }]
}

// Product (referenced)
{
  _id: ObjectId,
  name: String,
  price: Number,
  variants: [{
    size: String,
    color: String,
    stock: Number
  }]
}

// Order (referenced)
{
  _id: ObjectId,
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }]
}
\`\`\`

## Indexing Strategy
- Compound index on frequently queried fields
- Text index for search functionality
- Unique index on email/usernames`,
      question: question2._id,
      author: user1._id,
      votes: {
        upvotes: [user2._id],
        downvotes: []
      }
    });

    await answer1.save();
    await answer2.save();
    console.log('💬 Created test answers');

    // Update questions with accepted answers
    question1.acceptedAnswer = answer1._id;
    await question1.save();

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Test Data Summary:');
    console.log('- Users: 3 (john_doe, jane_smith, admin)');
    console.log('- Questions: 3');
    console.log('- Answers: 2');
    console.log('\n🔑 Test Credentials:');
    console.log('- john@example.com / password123');
    console.log('- jane@example.com / password123');
    console.log('- admin@stackit.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
connectDB().then(seedData); 