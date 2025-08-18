#!/bin/bash

echo "🧪 Testing AI Job Assistant Backend Setup"
echo "========================================="

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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test 1: Check if we're in the right directory
echo ""
echo "📁 Test 1: Directory Structure"
echo "-----------------------------"
if [ -f "app/main.py" ]; then
    print_status 0 "Found FastAPI application"
else
    print_status 1 "FastAPI application not found"
    exit 1
fi

# Test 2: Check Python environment
echo ""
echo "🐍 Test 2: Python Environment"
echo "----------------------------"
ENVIRONMENT_DETECTED=false

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
            print_status 0 "Conda environment 'job_assistant' activated"
            ENVIRONMENT_DETECTED=true
        else
            print_warning "Could not activate conda environment"
        fi
    else
        print_info "Conda environment 'job_assistant' does not exist"
    fi
fi

# Check for venv environment
if [ "$ENVIRONMENT_DETECTED" = false ]; then
    if [ -d "venv" ] && [ -f "venv/bin/activate" ]; then
        print_info "Virtual environment detected"
        source venv/bin/activate
        if [ $? -eq 0 ]; then
            print_status 0 "Virtual environment activated"
            ENVIRONMENT_DETECTED=true
        else
            print_warning "Could not activate virtual environment"
        fi
    else
        print_info "No virtual environment found"
    fi
fi

# If no environment detected, check system Python
if [ "$ENVIRONMENT_DETECTED" = false ]; then
    print_warning "No specific environment detected, using system Python"
    print_info "Consider running ./setup_env.sh to create a proper environment"
fi

# Test 3: Check Python and packages
echo ""
echo "📦 Test 3: Python and Packages"
echo "-----------------------------"
PYTHON_VERSION=$(python --version 2>&1)
print_status 0 "Python version: $PYTHON_VERSION"

# Test required packages
python -c "import fastapi" 2>/dev/null
print_status $? "FastAPI"

python -c "import uvicorn" 2>/dev/null
print_status $? "Uvicorn"

python -c "import langchain" 2>/dev/null
print_status $? "LangChain"

python -c "import torch" 2>/dev/null
print_status $? "PyTorch"

python -c "import transformers" 2>/dev/null
print_status $? "Transformers"

# Test 4: Run the test script
echo ""
echo "🧪 Test 4: Application Test"
echo "--------------------------"
if [ -f "test_anaconda_setup.py" ]; then
    python test_anaconda_setup.py
    if [ $? -eq 0 ]; then
        print_status 0 "Application test passed"
    else
        print_status 1 "Application test failed"
    fi
else
    print_warning "test_anaconda_setup.py not found, skipping"
fi

# Test 5: Check if server can start
echo ""
echo "🌐 Test 5: Server Startup Test"
echo "-----------------------------"
print_info "Testing server startup (will stop after 5 seconds)..."
timeout 5s python -m uvicorn app.main:app --host 0.0.0.0 --port 8080 &
SERVER_PID=$!
sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    print_status 0 "Server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    print_status 1 "Server failed to start"
fi

echo ""
echo -e "${GREEN}🎉 All tests completed!${NC}"
echo ""
echo "To run the backend:"
echo "  ./run.sh"
echo ""
echo "Or use make:"
echo "  make run-local"
