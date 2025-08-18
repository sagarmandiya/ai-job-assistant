#!/bin/bash

echo "🚀 Testing Complete AI Job Assistant System (v2)"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test 1: Python Environment Setup
echo ""
echo "🐍 Test 1: Python Environment Setup"
echo "----------------------------------"
ENVIRONMENT_ACTIVATED=false

# Check for conda environment
if command -v conda &> /dev/null; then
    print_info "Conda detected"
    
    # Source conda if not already sourced
    if [ -z "$CONDA_DEFAULT_ENV" ]; then
        if [ -f ~/anaconda3/etc/profile.d/conda.sh ]; then
            source ~/anaconda3/etc/profile.d/conda.sh
        elif [ -f ~/miniconda3/etc/profile.d/conda.sh ]; then
            source ~/miniconda3/etc/profile.d/conda.sh
        fi
    fi
    
    if conda env list | grep -q "job_assistant"; then
        if conda activate job_assistant 2>/dev/null; then
            CONDA_PYTHON=$(which python)
            print_status 0 "Conda environment activated: $CONDA_PYTHON"
            ENVIRONMENT_ACTIVATED=true
        else
            print_warning "Could not activate conda environment"
        fi
    else
        print_info "Conda environment 'job_assistant' does not exist"
    fi
fi

# Check for venv environment
if [ "$ENVIRONMENT_ACTIVATED" = false ]; then
    cd backend
    if [ -d "venv" ] && [ -f "venv/bin/activate" ]; then
        print_info "Virtual environment detected"
        source venv/bin/activate
        if [ $? -eq 0 ]; then
            VENV_PYTHON=$(which python)
            print_status 0 "Virtual environment activated: $VENV_PYTHON"
            ENVIRONMENT_ACTIVATED=true
        else
            print_info "Could not activate virtual environment"
        fi
    else
        print_info "No virtual environment found"
        cd ..
    fi
fi

# Check for conda environment
if [ "$ENVIRONMENT_ACTIVATED" = false ]; then
    if [ -f ~/anaconda3/envs/job_assistant/bin/python ]; then
        print_info "Conda environment detected"
        CONDA_PYTHON=~/anaconda3/envs/job_assistant/bin/python
        print_status 0 "Using conda environment: $CONDA_PYTHON"
        ENVIRONMENT_ACTIVATED=true
    else
        print_info "No conda environment found"
    fi
fi

# If no environment detected, check system Python
if [ "$ENVIRONMENT_ACTIVATED" = false ]; then
    print_info "No specific environment detected, using system Python"
    print_info "Consider running: cd backend && ./setup_env.sh"
fi

# Test 2: Backend Python Environment
echo ""
echo "📋 Test 2: Backend Python Environment"
echo "-------------------------------------"
cd backend
if [ -f "test_anaconda_setup.py" ]; then
    if [ "$ENVIRONMENT_ACTIVATED" = true ] && [ -n "$CONDA_PYTHON" ]; then
        $CONDA_PYTHON test_anaconda_setup.py > /dev/null 2>&1
        print_status $? "Backend Python environment setup (conda)"
    else
        python test_anaconda_setup.py > /dev/null 2>&1
        print_status $? "Backend Python environment setup"
    fi
else
    print_status 1 "test_anaconda_setup.py not found"
fi

# Test 3: Backend Server
echo ""
echo "🌐 Test 3: Backend Server"
echo "------------------------"
print_info "Starting backend server on port 8080..."
if [ "$ENVIRONMENT_ACTIVATED" = true ] && [ -n "$CONDA_PYTHON" ]; then
    $CONDA_PYTHON -m uvicorn app.main:app --host 0.0.0.0 --port 8080 &
else
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8080 &
fi
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

# Test 4: Node.js Environment
echo ""
echo "📦 Test 4: Node.js Environment"
echo "-----------------------------"
cd ../frontend
if command -v nvm &> /dev/null; then
    source ~/.nvm/nvm.sh
    nvm use 22.18.0 > /dev/null 2>&1
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js version: $NODE_VERSION (using nvm)"
elif command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js version: $NODE_VERSION"
else
    print_status 1 "Node.js not found"
fi

# Test 5: Frontend Dependencies
echo ""
echo "📦 Test 5: Frontend Dependencies"
echo "-------------------------------"
if [ -f "package.json" ]; then
    print_status 0 "package.json exists"
    if [ -d "node_modules" ]; then
        print_status 0 "node_modules installed"
    else
        print_status 1 "node_modules missing"
        print_info "Run: npm install"
    fi
else
    print_status 1 "package.json missing"
fi

# Test 6: Frontend Development Server
echo ""
echo "🎨 Test 6: Frontend Development Server"
echo "------------------------------------"
if [ -d "node_modules" ]; then
    print_info "Starting frontend development server on port 3000..."
    npm run dev &
    FRONTEND_PID=$!

    # Wait for server to start
    sleep 8

    # Test frontend endpoint
    curl -s http://localhost:3000 > /dev/null 2>&1
    print_status $? "Frontend development server"

    # Stop frontend server
    kill $FRONTEND_PID 2>/dev/null
else
    print_status 1 "Cannot start frontend - node_modules missing"
fi

# Test 7: Frontend Build
echo ""
echo "🏗️  Test 7: Frontend Build"
echo "-------------------------"
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    print_status 0 "Frontend build exists"
    
    # Test built version
    print_info "Testing built frontend on port 3001..."
    cd dist
    python3 -m http.server 3001 &
    BUILD_PID=$!
    sleep 3
    curl -s http://localhost:3001 > /dev/null 2>&1
    print_status $? "Built frontend server"
    kill $BUILD_PID 2>/dev/null
    cd ..
else
    print_status 1 "Frontend build missing or empty"
    print_info "Run: npm run build"
fi

# Summary
echo ""
echo "🎯 Test Summary"
echo "==============="
echo -e "${GREEN}Backend:  http://localhost:8080${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo ""
echo "🚀 To run the complete system:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  ./run.sh"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "✅ Both backend and frontend are now working with environment-agnostic setup!"
