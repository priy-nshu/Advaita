# Triwizard Quiz Server

A real-time multiplayer quiz game server built with Node.js, Express, TypeScript, and Socket.IO.

## Features

- User authentication with JWT
- Real-time game updates using Socket.IO
- MongoDB database integration
- TypeScript for type safety
- Environment-based configuration
- Input validation using Zod
- Error handling middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=24h
   MONGODB_URI=mongodb://localhost:27017/triwizard-quiz
   CORS_ORIGIN=http://localhost:4200
   ```

## Development

To start the development server:

```bash
npm run dev
```

## Building

To build the project:

```bash
npm run build
```

## Production

To start the production server:

```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Health Check
- GET `/api/health` - Check server health

## Socket Events

### Client to Server
- `joinGame` - Join a game room
- `submitAnswer` - Submit an answer
- `leaveGame` - Leave a game room

### Server to Client
- `gameUpdate` - Game state update
- `gameEnd` - Game end notification
- `error` - Error notification

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── server.ts       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 