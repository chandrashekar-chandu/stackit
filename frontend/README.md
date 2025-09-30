# StackIt Frontend

A modern Q&A platform frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to http://localhost:3000

## 🎯 Features

### Core Functionality
- **Browse Questions**: View all questions with filtering and sorting
- **User Authentication**: Register, login, and logout functionality
- **Ask Questions**: Create new questions with tags
- **Answer Questions**: Provide answers to questions
- **Voting System**: Upvote/downvote questions and answers
- **User Profiles**: View user activity and statistics
- **Responsive Design**: Works on all devices

### Mock Data
The frontend includes a comprehensive mock API that simulates:
- User authentication and registration
- Question creation and management
- Answer posting and voting
- User profiles and statistics
- Tag system and filtering

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── Home.tsx        # Questions list
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── AskQuestion.tsx # Question creation
│   ├── QuestionDetail.tsx # Question view
│   ├── UserProfile.tsx # User profile
│   └── Demo.tsx        # Demo showcase
├── services/           # API services
│   └── mockApi.ts      # Mock API implementation
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray Scale**: 50-900 for text and backgrounds

### Components
- **Cards**: Clean white cards with subtle shadows
- **Buttons**: Primary, secondary, and outline variants
- **Inputs**: Consistent form inputs with focus states
- **Icons**: Lucide React icons throughout

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎭 Mock API

The frontend uses a mock API that simulates all backend functionality:

### Authentication
- Register new users
- Login with email/password
- JWT token management
- User session persistence

### Questions
- List questions with pagination
- Filter by tags
- Sort by votes, views, date
- Create new questions
- Vote on questions

### Answers
- Post answers to questions
- Vote on answers
- Accept answers (question author only)

### Users
- View user profiles
- See user questions and answers
- Track user statistics

## 🚀 Demo Mode

Visit `/demo` to see a showcase of the platform features with sample data.

## 🔗 Navigation

- **Home** (`/`) - Browse all questions
- **Demo** (`/demo`) - Feature showcase
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - Create account
- **Ask Question** (`/ask`) - Post new question (requires login)
- **Question Detail** (`/questions/:id`) - View question and answers
- **User Profile** (`/users/:id`) - View user activity

## 🎯 Sample Data

The mock API includes sample data:
- **Users**: john_doe, jane_smith (admin)
- **Questions**: React auth, TypeScript practices, Database design
- **Answers**: Helpful responses with voting
- **Tags**: react, typescript, nodejs, authentication, database

## 🔒 Authentication

The mock authentication system supports:
- User registration with username, email, password
- Login with email and password
- JWT token storage in localStorage
- Protected routes for authenticated users
- User role management (user/admin)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for global styles
- Component-specific styles in individual files

### Mock Data
- Edit `src/services/mockApi.ts` to modify sample data
- Add new mock endpoints as needed
- Customize API response formats

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo for automatic deployment
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment
- **Any Static Host**: Serve the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 