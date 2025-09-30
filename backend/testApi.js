const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpass123'
};

let authToken = '';
let questionId = '';

const testAPI = async () => {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: Register User
    console.log('\n2️⃣ Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    authToken = registerResponse.data.data.token;
    console.log('✅ User Registered:', registerResponse.data.data.user.username);

    // Test 3: Login User
    console.log('\n3️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User Logged In:', loginResponse.data.data.user.username);

    // Test 4: Get Questions (Public)
    console.log('\n4️⃣ Testing Get Questions...');
    const questionsResponse = await axios.get(`${API_BASE}/questions`);
    console.log('✅ Questions Retrieved:', questionsResponse.data.data.questions.length, 'questions');

    // Test 5: Create Question (Authenticated)
    console.log('\n5️⃣ Testing Create Question...');
    const questionData = {
      title: 'Test Question: How to test API endpoints?',
      description: 'This is a test question to verify that the API is working correctly. I want to know the best practices for testing REST APIs.',
      tags: ['testing', 'api', 'javascript']
    };

    const createQuestionResponse = await axios.post(`${API_BASE}/questions`, questionData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    questionId = createQuestionResponse.data.data.question._id;
    console.log('✅ Question Created:', createQuestionResponse.data.data.question.title);

    // Test 6: Get Single Question
    console.log('\n6️⃣ Testing Get Single Question...');
    const singleQuestionResponse = await axios.get(`${API_BASE}/questions/${questionId}`);
    console.log('✅ Single Question Retrieved:', singleQuestionResponse.data.data.question.title);

    // Test 7: Vote on Question
    console.log('\n7️⃣ Testing Question Voting...');
    const voteResponse = await axios.post(`${API_BASE}/questions/${questionId}/vote`, 
      { vote: 1 }, 
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Question Voted:', voteResponse.data.message);

    // Test 8: Create Answer
    console.log('\n8️⃣ Testing Create Answer...');
    const answerData = {
      content: 'This is a test answer to verify that the answer creation API is working correctly. The API should handle markdown formatting and store the answer properly.'
    };

    const createAnswerResponse = await axios.post(`${API_BASE}/questions/${questionId}/answers`, answerData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const answerId = createAnswerResponse.data.data.answer._id;
    console.log('✅ Answer Created:', createAnswerResponse.data.data.answer.content.substring(0, 50) + '...');

    // Test 9: Get User Profile
    console.log('\n9️⃣ Testing Get User Profile...');
    const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User Profile Retrieved:', profileResponse.data.data.user.username);

    // Test 10: Get Questions with Auth
    console.log('\n🔟 Testing Get Questions with Authentication...');
    const authQuestionsResponse = await axios.get(`${API_BASE}/questions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Authenticated Questions Retrieved:', authQuestionsResponse.data.data.questions.length, 'questions');

    console.log('\n🎉 All API Tests Passed Successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ Health Check');
    console.log('- ✅ User Registration');
    console.log('- ✅ User Login');
    console.log('- ✅ Get Questions (Public)');
    console.log('- ✅ Create Question (Authenticated)');
    console.log('- ✅ Get Single Question');
    console.log('- ✅ Vote on Question');
    console.log('- ✅ Create Answer');
    console.log('- ✅ Get User Profile');
    console.log('- ✅ Get Questions (Authenticated)');

  } catch (error) {
    console.error('\n❌ API Test Failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
};

// Run the tests
testAPI(); 