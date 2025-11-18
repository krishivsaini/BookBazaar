# BookBazaar Backend

Backend API for BookBazaar - An online book marketplace.

## Features

- User Authentication (Signup/Login)
- JWT-based authorization
- MongoDB database integration
- RESTful API design
- Password hashing with bcrypt

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## Installation

```bash
cd backend
npm install
```

## Running Locally

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Deployment

### Render/Railway/Heroku
1. Create a new web service
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Add environment variables
5. Deploy!

### Vercel
Already configured with `vercel.json`
```bash
npm install -g vercel
vercel
```
