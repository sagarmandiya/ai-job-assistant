# Authentication Setup Guide

This guide will help you set up the PostgreSQL database and authentication system for the AI Job Assistant.

## Prerequisites

- Docker and Docker Compose installed
- Python 3.8+ installed
- Node.js 16+ installed

## Quick Setup

1. **Run the setup script:**
   ```bash
   ./setup_auth.sh
   ```

2. **Start the backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8080
   ```

3. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/docs

## Default Credentials

- **Email:** admin@example.com
- **Password:** admin123

## Manual Setup (if needed)

### 1. Start Database Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Redis cache on port 6379

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Initialize Database

```bash
python init_db.py
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_job_assistant

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Other settings
OPENAI_API_KEY=your-openai-key
PPLX_API_KEY=your-perplexity-key
```

## API Endpoints

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info (protected)
- `POST /auth/refresh` - Refresh access token (protected)

### Request Examples

**Register:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Login:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Frontend Features

- **Login Page:** `/login`
- **Register Page:** `/register`
- **Protected Routes:** All `/app/*` routes require authentication
- **User Profile:** Click on user avatar in header to see profile and logout

## Security Features

- **Password Hashing:** Uses bcrypt for secure password storage
- **JWT Tokens:** Secure token-based authentication
- **Protected Routes:** Automatic redirection for unauthenticated users
- **Token Refresh:** Automatic token refresh mechanism
- **CORS Configuration:** Proper CORS setup for frontend-backend communication

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `hashed_password` - Bcrypt hashed password
- `full_name` - Optional full name
- `is_active` - Account status
- `is_verified` - Email verification status
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

## Troubleshooting

### Database Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`

### Authentication Issues
- Verify JWT secret key in environment
- Check token expiration settings
- Ensure CORS is properly configured

### Frontend Issues
- Clear browser localStorage if token issues persist
- Check browser console for API errors
- Verify backend is running on correct port

## Development Notes

- The authentication system uses JWT tokens stored in localStorage
- Tokens expire after 30 minutes by default
- All protected API endpoints require the `Authorization: Bearer <token>` header
- The frontend automatically redirects to login for unauthenticated users
