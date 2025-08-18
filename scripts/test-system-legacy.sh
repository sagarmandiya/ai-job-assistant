#!/bin/bash

echo "🚀 Testing Complete AI Job Assistant System"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Backend Python Environment
echo ""
echo "📋 Test 1: Backend Python Environment"
echo "-------------------------------------"
cd backend
~/anaconda3/envs/job_assistant/bin/python test_anaconda_setup.py > /dev/null 2>&1
print_status $? "Backend Python environment setup"

# Test 2: Backend Server
echo ""
echo "🌐 Test 2: Backend Server"
echo "------------------------"
echo "Starting backend server on port 8080..."
~/anaconda3/envs/job_assistant/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8080 &
BACKEND_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
curl -s http://localhost:8080/health > /dev/null 2>&1
print_status $? "Backend health endpoint"

# Test API documentation endpoint
curl -s http://localhost:8080/docs > /dev/null 2>&1
print_status $? "Backend API documentation"

# Stop backend server
kill $BACKEND_PID 2>/dev/null

# Test 3: Frontend Build
echo ""
echo "🎨 Test 3: Frontend Build"
echo "------------------------"
cd ../frontend

# Check if dist folder exists and has content
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    print_status 0 "Frontend build exists"
else
    print_status 1 "Frontend build missing or empty"
fi

# Test 4: Frontend Server (using built version)
echo ""
echo "🌐 Test 4: Frontend Server"
echo "-------------------------"
echo "Starting frontend server on port 3000..."
cd dist
python3 -m http.server 3000 &
FRONTEND_PID=$!

# Wait for server to start
sleep 3

# Test frontend endpoint
curl -s http://localhost:3000 > /dev/null 2>&1
print_status $? "Frontend server"

# Stop frontend server
kill $FRONTEND_PID 2>/dev/null

# Test 5: Node.js Version Check
echo ""
echo "📦 Test 5: Node.js Environment"
echo "-----------------------------"
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 16 ]; then
    print_status 0 "Node.js version $NODE_VERSION (compatible)"
else
    print_status 1 "Node.js version $NODE_VERSION (needs v16+)"
fi

# Test 6: Package Dependencies
echo ""
echo "📦 Test 6: Package Dependencies"
echo "-----------------------------"
if [ -f "package.json" ]; then
    print_status 0 "package.json exists"
    if [ -d "node_modules" ]; then
        print_status 0 "node_modules installed"
    else
        print_status 1 "node_modules missing"
    fi
else
    print_status 1 "package.json missing"
fi

# Summary
echo ""
echo "🎯 Test Summary"
echo "==============="
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "To run the complete system:"
echo "1. Backend: cd backend && ./run_with_anaconda.sh"
echo "2. Frontend: cd frontend/dist && python3 -m http.server 3000"
echo ""
echo "Note: Frontend development server requires Node.js v16+ for Vite"
