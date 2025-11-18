# BookBazaar Frontend

React-based frontend for BookBazaar - An online book marketplace.

## Features

- User Authentication (Login/Signup)
- Protected Routes
- Responsive Design
- Modern UI with CSS animations
- JWT token management
- Context API for state management

## Tech Stack

- React 18
- React Router v6
- Axios for API calls
- Context API for state management

## Pages

- **Home** - Landing page with features
- **Login** - User login page
- **Signup** - User registration page
- **Dashboard** - Protected user dashboard

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production, set:
```env
REACT_APP_API_URL=your_backend_url/api
```

## Installation

```bash
cd frontend
npm install
```

## Running Locally

```bash
npm start
```

The app will run on `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variable: `REACT_APP_API_URL=your_backend_url/api`

### Netlify
1. Build the app: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### GitHub Pages
1. Install: `npm install gh-pages --save-dev`
2. Add to package.json: `"homepage": "https://yourusername.github.io/bookbazaar"`
3. Add scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Run: `npm run deploy`
