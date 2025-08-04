# MUNCGLOBAL Project

A fully responsive, professional, and interactive website for MUNCGLOBAL, an international youth leadership organization. The project follows a client-server architecture with a React frontend and Node.js backend.

## Project Structure

The project is organized into two main folders:

- `client`: React frontend built with Vite and Tailwind CSS
- `server`: Node.js backend with Express and SQLite

This structure allows for easier full-stack development and clear separation of concerns.

## Features

- Responsive design for all devices
- Interactive UI with animations using Framer Motion
- Multi-step registration form with validation
- Paystack payment integration with real-time verification
- Unique delegate ID generation
- Email notifications
- Admin dashboard (planned)

## Client (Frontend)

### Technologies

- React 18
- Vite
- React Router DOM v6
- Tailwind CSS
- Framer Motion
- React Hook Form + Yup
- Axios

### Setup

1. Navigate to the client directory:
   ```
   cd muncglobal-project/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Server (Backend)

### Technologies

- Node.js
- Express
- SQLite (can be upgraded to PostgreSQL)
- Nodemailer
- UUID for unique ID generation

### Setup

1. Navigate to the server directory:
   ```
   cd muncglobal-project/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration values

5. Start the development server:
   ```
   npm run dev
   ```

6. Start for production:
   ```
   npm start
   ```

## Running the Full Stack Application

For development, you'll need to run both the client and server:

1. Start the server (in one terminal):
   ```
   cd muncglobal-project/server
   npm run dev
   ```

2. Start the client (in another terminal):
   ```
   cd muncglobal-project/client
   npm run dev
   ```

The client will be available at http://localhost:5173 and will proxy API requests to the server at https://muncglobal-project-server.onrender.com.

## Deployment

### Frontend

The frontend can be deployed to platforms like Netlify, Vercel, or GitHub Pages:

1. Build the client:
   ```
   cd muncglobal-project/client
   npm run build
   ```

2. Deploy the `dist` directory to your hosting provider

### Backend

The backend can be deployed to platforms like Heroku, Railway, or DigitalOcean:

1. Set up environment variables on your hosting platform
2. Deploy the server code
3. Configure your frontend to use the deployed backend URL

## Development Workflow

1. Frontend-first development with mocked API responses
2. Backend API implementation
3. Integration of frontend and backend
4. Testing and refinement

## Pages

- Home
- About
- Leadership Team
- Programs & Foundations
- Conference (MUNC-GH 2025)
- Registration Form
- Payment Policies
- Events
- Contact

## Future Enhancements

- Admin dashboard for managing registrations
- Real-time analytics
- Document upload for delegates
- Conference schedule management
- Participant networking features
