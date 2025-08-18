#!/bin/bash

echo "🚀 Starting AI Job Assistant Backend"
echo "===================================="

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

# Check if we're in the backend directory
if [ ! -f "app/main.py" ]; then
    echo -e "${RED}❌ app/main.py not found. Please run this script from the backend directory.${NC}"
    exit 1
fi

print_status 0 "Found FastAPI application: app/main.py"

# Environment detection and activation
ENVIRONMENT_ACTIVATED=false

# Try to activate conda environment first (if available)
if command -v conda &> /dev/null; then
    print_info "Checking for conda environment..."
    
    # Source conda if not already sourced
    if [ -z "$CONDA_DEFAULT_ENV" ]; then
        if [ -f ~/anaconda3/etc/profile.d/conda.sh ]; then
            source ~/anaconda3/etc/profile.d/conda.sh
        elif [ -f ~/miniconda3/etc/profile.d/conda.sh ]; then
            source ~/miniconda3/etc/profile.d/conda.sh
        fi
    fi
    
    # Try to activate the conda environment
    if conda env list | grep -q "job_assistant"; then
        if conda activate job_assistant 2>/dev/null; then
            print_status 0 "Conda environment 'job_assistant' activated"
            ENVIRONMENT_ACTIVATED=true
        else
            print_warning "Could not activate conda environment, trying manual activation..."
            # Try to find the Python interpreter
            CONDA_PYTHON=""
            if [ -f ~/anaconda3/envs/job_assistant/bin/python ]; then
                CONDA_PYTHON=~/anaconda3/envs/job_assistant/bin/python
            elif [ -f ~/miniconda3/envs/job_assistant/bin/python ]; then
                CONDA_PYTHON=~/miniconda3/envs/job_assistant/bin/python
            fi
            
            if [ -n "$CONDA_PYTHON" ]; then
                print_status 0 "Found conda Python: $CONDA_PYTHON"
                export PATH="$(dirname $CONDA_PYTHON):$PATH"
                ENVIRONMENT_ACTIVATED=true
            else
                print_warning "Could not find conda Python interpreter"
            fi
        fi
    else
        print_info "Conda environment 'job_assistant' does not exist"
    fi
fi

# If conda environment not activated, try venv
if [ "$ENVIRONMENT_ACTIVATED" = false ]; then
    print_info "Checking for virtual environment..."
    
    if [ -d "venv" ] && [ -f "venv/bin/activate" ]; then
        print_info "Found virtual environment, activating..."
        source venv/bin/activate
        if [ $? -eq 0 ]; then
            print_status 0 "Virtual environment activated"
            ENVIRONMENT_ACTIVATED=true
        else
            print_warning "Could not activate virtual environment"
        fi
    else
        print_info "No virtual environment found"
    fi
fi

# If no environment is activated, check if we're in a global environment
if [ "$ENVIRONMENT_ACTIVATED" = false ]; then
    print_warning "No specific environment detected, using system Python"
    print_info "Consider running ./setup_env.sh to create a proper environment"
fi

# Check Python version
PYTHON_VERSION=$(python --version 2>&1)
print_status 0 "Python version: $PYTHON_VERSION"

# Check if required packages are available
print_info "Checking required packages..."
python -c "import fastapi, uvicorn, langchain" 2>/dev/null
if [ $? -eq 0 ]; then
    print_status 0 "Required packages are available"
else
    print_status 1 "Required packages are missing"
    print_info "Please run: ./setup_env.sh"
    exit 1
fi

# Start the FastAPI server
echo ""
print_info "Starting FastAPI server..."
echo -e "${GREEN}📍 Server will be available at: http://localhost:8080${NC}"
echo -e "${GREEN}📖 API documentation will be available at: http://localhost:8080/docs${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
