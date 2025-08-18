#!/bin/bash

echo "🚀 Setting up Environment for Job Assistant Backend"
echo "=================================================="

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

# Determine environment setup method
USE_CONDA=false
USE_VENV=false

# Check if conda is available and user wants to use it
if command -v conda &> /dev/null; then
    print_info "Conda detected: $(conda --version)"
    
    # Check if conda environment already exists
    if conda env list | grep -q "job_assistant"; then
        print_warning "Conda environment 'job_assistant' already exists"
        read -p "Do you want to use conda environment? (Y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            USE_CONDA=true
        fi
    else
        read -p "Do you want to create a conda environment? (Y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            USE_CONDA=true
        fi
    fi
fi

# If not using conda, use venv
if [ "$USE_CONDA" = false ]; then
    USE_VENV=true
    print_info "Using Python virtual environment (venv)"
fi

# Setup conda environment
if [ "$USE_CONDA" = true ]; then
    print_info "Setting up conda environment..."
    
    if [ -f "environment.yml" ]; then
        conda env create -f environment.yml
        if [ $? -eq 0 ]; then
            print_status 0 "Conda environment created successfully"
        else
            print_status 1 "Failed to create conda environment"
            exit 1
        fi
    else
        print_status 1 "environment.yml not found"
        exit 1
    fi
    
    # Activate environment
    print_info "Activating conda environment..."
    conda activate job_assistant
    if [ $? -eq 0 ]; then
        print_status 0 "Conda environment activated"
    else
        print_status 1 "Failed to activate conda environment"
        exit 1
    fi
fi

# Setup venv environment
if [ "$USE_VENV" = true ]; then
    print_info "Setting up Python virtual environment..."
    
    # Check if venv already exists
    if [ -d "venv" ]; then
        print_warning "Virtual environment 'venv' already exists"
        read -p "Do you want to recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Removing existing virtual environment..."
            rm -rf venv
        else
            print_info "Using existing virtual environment"
        fi
    fi
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        if [ $? -eq 0 ]; then
            print_status 0 "Virtual environment created successfully"
        else
            print_status 1 "Failed to create virtual environment"
            exit 1
        fi
    fi
    
    # Activate virtual environment
    print_info "Activating virtual environment..."
    source venv/bin/activate
    if [ $? -eq 0 ]; then
        print_status 0 "Virtual environment activated"
    else
        print_status 1 "Failed to activate virtual environment"
        exit 1
    fi
    
    # Install dependencies
    print_info "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        print_status 0 "Dependencies installed successfully"
    else
        print_status 1 "Failed to install dependencies"
        exit 1
    fi
fi

# Verify Python version
PYTHON_VERSION=$(python --version 2>&1)
print_status 0 "Python version: $PYTHON_VERSION"

# Test the setup
print_info "Testing the setup..."
if [ -f "test_anaconda_setup.py" ]; then
    python test_anaconda_setup.py
    if [ $? -eq 0 ]; then
        print_status 0 "Setup test passed"
    else
        print_status 1 "Setup test failed"
        exit 1
    fi
else
    print_warning "test_anaconda_setup.py not found, skipping test"
fi

echo ""
echo -e "${GREEN}🎉 Environment setup completed successfully!${NC}"
echo ""

if [ "$USE_CONDA" = true ]; then
    echo "To activate the conda environment in the future:"
    echo "  conda activate job_assistant"
elif [ "$USE_VENV" = true ]; then
    echo "To activate the virtual environment in the future:"
    echo "  source venv/bin/activate"
fi

echo ""
echo "To run the backend:"
echo "  ./run.sh"
echo ""
echo "Or use the convenience script:"
echo "  ./run.sh"
