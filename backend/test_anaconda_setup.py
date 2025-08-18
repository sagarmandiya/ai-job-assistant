#!/usr/bin/env python3
"""
Test script to verify Anaconda Python setup for the Job Assistant backend.
"""

import sys
import importlib

def test_imports():
    """Test if all required packages can be imported."""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'sqlalchemy',
        'alembic',
        'psycopg2',
        'redis',
        'celery',
        'langchain',
        'openai',
        'anthropic',
        'chromadb',
        'sentence_transformers',
        'numpy',
        'pandas',
        'requests',
        'multipart',
        'jose',
        'passlib',
        'bcrypt'
    ]
    
    print("🧪 Testing Anaconda Python setup...")
    print(f"📋 Python executable: {sys.executable}")
    print(f"📋 Python version: {sys.version}")
    print()
    
    failed_imports = []
    
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError as e:
            print(f"❌ {package}: {e}")
            failed_imports.append(package)
    
    print()
    if failed_imports:
        print(f"❌ Failed to import {len(failed_imports)} packages:")
        for package in failed_imports:
            print(f"   - {package}")
        return False
    else:
        print("✅ All required packages imported successfully!")
        return True

def test_fastapi_app():
    """Test if the FastAPI application can be created."""
    try:
        from app.main import create_app
        app = create_app()
        print("✅ FastAPI application created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create FastAPI application: {e}")
        return False

def main():
    """Run all tests."""
    print("🚀 Testing Anaconda Python Setup for Job Assistant Backend")
    print("=" * 60)
    print()
    
    # Test imports
    imports_ok = test_imports()
    print()
    
    # Test FastAPI app
    app_ok = test_fastapi_app()
    print()
    
    # Summary
    if imports_ok and app_ok:
        print("🎉 All tests passed! Your Anaconda setup is ready.")
        print("You can now run the backend with:")
        print("  cd backend")
        print("  ./run_with_anaconda.sh")
    else:
        print("❌ Some tests failed. Please check your Anaconda environment setup.")
        print("Make sure all required packages are installed in the 'job_assistant' environment.")

if __name__ == "__main__":
    main()
