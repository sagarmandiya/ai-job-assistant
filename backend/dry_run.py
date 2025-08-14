#!/usr/bin/env python3
"""
Quick dry run script to verify basic functionality
"""

def quick_test():
    print("🔍 QUICK DRY RUN TEST")
    print("=" * 30)
    
    tests = []
    
    # Test 1: Environment
    try:
        import os
        from app.core.config import settings
        print(f"✅ Environment loaded: {settings.APP_NAME}")
        tests.append(True)
    except Exception as e:
        print(f"❌ Environment failed: {e}")
        tests.append(False)
    
    # Test 2: Embeddings
    try:
        from app.ai.embeddings import get_embeddings
        embeddings = get_embeddings()
        test_vector = embeddings.embed_query("test")
        print(f"✅ Embeddings working: {len(test_vector)} dimensions")
        tests.append(True)
    except Exception as e:
        print(f"❌ Embeddings failed: {e}")
        tests.append(False)
    
    # Test 3: Vectorstore
    try:
        from app.ai.vectorstore import get_vectorstore
        vs = get_vectorstore("test")
        print("✅ Vectorstore created")
        tests.append(True)
    except Exception as e:
        print(f"❌ Vectorstore failed: {e}")
        tests.append(False)
    
    # Test 4: Server import
    try:
        from app.main import app
        print("✅ FastAPI app imported")
        tests.append(True)
    except Exception as e:
        print(f"❌ FastAPI app failed: {e}")
        tests.append(False)
    
    success_rate = sum(tests) / len(tests) * 100
    print(f"\n🎯 Success Rate: {success_rate:.1f}% ({sum(tests)}/{len(tests)})")
    
    if success_rate == 100:
        print("🚀 Ready to start server!")
    else:
        print("⚠️ Fix issues before starting server")

if __name__ == "__main__":
    quick_test()
