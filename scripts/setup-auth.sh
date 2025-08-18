#!/bin/bash

echo "🚀 Setting up AI Job Assistant with Authentication"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Starting PostgreSQL and Redis containers..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# echo "🔧 Installing backend dependencies..."
cd backend
# pip install -r requirements.txt

echo "🗄️ Initializing database..."
python init_db.py

echo "✅ Database setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend: cd backend && uvicorn app.main:app --reload --port 8080"
echo "2. Start the frontend: cd frontend && npm run dev"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "🌐 Access the application at: http://localhost:5173"
