# 📚 BookBazaar - Online Book Marketplace

A full-stack web application for buying and selling books, built with the MERN stack (MongoDB, Express, React, Node.js).

## 📋 Project Proposal

📄 **[View Complete Project Proposal (PDF)](./BookBazaar_Project_Proposal.pdf)**

---

## 🎯 Milestone 1: Authentication & Deployment ✅

This milestone includes:
- ✅ User Registration (Signup)
- ✅ User Login with JWT Authentication
- ✅ Protected Routes & Dashboard
- ✅ End-to-end hosting setup
- ✅ Frontend, Backend, and Database configuration

## 🚀 Project Structure

```
BookBazaar/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
│
├── frontend/               # React application
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── context/       # Context API
│       ├── pages/         # Page components
│       ├── utils/         # API configuration
│       └── App.js         # Main app component
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BookBazaar.git
cd BookBazaar
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookbazaar
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud Database):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` with:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bookbazaar?retryWrites=true&w=majority
   ```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🌐 Deployment Guide

### Database - MongoDB Atlas (Free Tier)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Setup Access**:
   - Create a database user
   - Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)
4. **Get Connection String**: Click "Connect" → "Connect your application"
5. **Update Backend**: Use the connection string in your backend `.env`

### Backend - Render (Free Tier)

1. **Create Account**: Go to [Render](https://render.com)
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect Repository**: Link your GitHub repo
4. **Configure**:
   - **Name**: bookbazaar-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Add these in Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=your_frontend_url
   ```
6. **Deploy**: Click "Create Web Service"

**Alternative Options:**
- **Railway**: Similar to Render, great free tier
- **Heroku**: Add Procfile (already included)
- **Vercel**: Use vercel.json (already configured)

### Frontend - Vercel (Free Tier)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variable**:
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `REACT_APP_API_URL=your_backend_url/api`

4. **Redeploy**: `vercel --prod`

**Alternative Options:**
- **Netlify**: Drag & drop the `build` folder
- **GitHub Pages**: For static hosting (add proxy config)

## 🧪 Testing the Application

### Test Signup
1. Go to `http://localhost:3000/signup`
2. Create a new account
3. You should be redirected to the dashboard

### Test Login
1. Go to `http://localhost:3000/login`
2. Login with your credentials
3. Access the protected dashboard

### Test Protected Routes
1. Try accessing `/dashboard` without logging in
2. You should be redirected to login page

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
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

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected routes with middleware
- CORS configuration
- Input validation with express-validator
- HTTP-only cookie support ready

## 📱 Features Implemented

### Milestone 1 ✅
- [x] User Registration with validation
- [x] User Login with JWT
- [x] Password encryption
- [x] Protected routes
- [x] User dashboard
- [x] Responsive design
- [x] Error handling
- [x] Backend API
- [x] MongoDB integration
- [x] Deployment configuration

## 🎨 Screenshots

The application includes:
- **Landing Page**: Hero section with features
- **Login Page**: Clean authentication form
- **Signup Page**: User registration with validation
- **Dashboard**: Protected user area

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas cluster is active
- Check your connection string
- Verify IP whitelist in MongoDB Atlas

### CORS Errors
- Check `CLIENT_URL` in backend `.env`
- Ensure frontend URL matches

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration time
- Clear localStorage and login again

## 🚀 Next Steps (Future Milestones)

- [ ] Book listing and management
- [ ] Search and filtering
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Payment integration
- [ ] Reviews and ratings
- [ ] Admin panel
- [ ] Email notifications

## 👨‍💻 Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Style
- ESLint configured for both frontend and backend
- Follow React best practices
- Use meaningful variable names
- Comment complex logic

## 📝 License

This project is for educational purposes as part of a capstone project.

## 🤝 Contributing

This is a capstone project, but suggestions are welcome!

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for BookBazaar Capstone Project**
