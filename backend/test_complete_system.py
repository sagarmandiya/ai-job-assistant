#!/usr/bin/env python3
"""
Complete system test for AI Job Assistant Backend
Tests all components: imports, API endpoints, vectorstore, LLM, file processing
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

class SystemTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.test_results = []
        
    def log_test(self, test_name, success, message=""):
        status = f"{Colors.GREEN}✅ PASS{Colors.END}" if success else f"{Colors.RED}❌ FAIL{Colors.END}"
        print(f"{status} {test_name}: {message}")
        self.test_results.append((test_name, success, message))
        
    def test_imports(self):
        """Test all critical imports"""
        print(f"\n{Colors.BLUE}=== TESTING IMPORTS ==={Colors.END}")
        
        import_tests = [
            ("FastAPI", "import fastapi"),
            ("Uvicorn", "import uvicorn"),
            ("Pydantic Settings", "from pydantic_settings import BaseSettings"),
            ("PyMuPDF", "import fitz"),
            ("Embeddings", "from app.ai.embeddings import get_embeddings"),
            ("LLM Factory", "from app.ai.llm_factory import get_llm"),
            ("Vectorstore", "from app.ai.vectorstore import get_vectorstore"),
        ]
        
        for name, import_cmd in import_tests:
            try:
                exec(import_cmd)
                self.log_test(f"Import {name}", True)
            except Exception as e:
                self.log_test(f"Import {name}", False, str(e))
                
    def test_vectorstore_creation(self):
        """Test vectorstore creation and basic operations"""
        print(f"\n{Colors.BLUE}=== TESTING VECTORSTORE ==={Colors.END}")
        
        try:
            from app.ai.vectorstore import get_vectorstore
            vectorstore = get_vectorstore("test_index")
            self.log_test("Vectorstore Creation", True)
            
            # Test adding documents
            test_texts = ["This is a test document", "Another test document"]
            vectorstore.add_texts(test_texts)
            self.log_test("Add Documents to Vectorstore", True)
            
        except Exception as e:
            self.log_test("Vectorstore Operations", False, str(e))
            
    def test_embeddings(self):
        """Test embedding generation"""
        print(f"\n{Colors.BLUE}=== TESTING EMBEDDINGS ==={Colors.END}")
        
        try:
            from app.ai.embeddings import get_embeddings
            embeddings = get_embeddings()
            self.log_test("Embeddings Creation", True)
            
            # Test embedding a sample text
            test_embedding = embeddings.embed_query("This is a test sentence")
            if isinstance(test_embedding, list) and len(test_embedding) > 0:
                self.log_test("Embedding Generation", True, f"Vector dimension: {len(test_embedding)}")
            else:
                self.log_test("Embedding Generation", False, "Invalid embedding format")
                
        except Exception as e:
            self.log_test("Embeddings", False, str(e))
            
    def test_llm(self):
        """Test LLM functionality"""
        print(f"\n{Colors.BLUE}=== TESTING LLM ==={Colors.END}")
        
        try:
            from app.ai.llm_factory import get_llm
            llm = get_llm()
            self.log_test("LLM Creation", True)
            
            # Test LLM response (if API key available)
            if hasattr(llm, 'predict'):
                try:
                    response = llm.predict("Hello, this is a test.")
                    self.log_test("LLM Response", True, f"Response length: {len(response)}")
                except Exception as e:
                    self.log_test("LLM Response", False, f"API call failed: {str(e)}")
            else:
                self.log_test("LLM Response", False, "No predict method available")
                
        except Exception as e:
            self.log_test("LLM", False, str(e))

    def wait_for_server(self, timeout=30):
        """Wait for server to be ready"""
        print(f"{Colors.YELLOW}Waiting for server to start...{Colors.END}")
        
        for i in range(timeout):
            try:
                response = requests.get(f"{self.base_url}/health", timeout=1)
                if response.status_code == 200:
                    print(f"{Colors.GREEN}Server is ready!{Colors.END}")
                    return True
            except:
                time.sleep(1)
                print(f"Waiting... ({i+1}/{timeout})")
                
        return False

    def test_api_endpoints(self):
        """Test all API endpoints"""
        print(f"\n{Colors.BLUE}=== TESTING API ENDPOINTS ==={Colors.END}")
        
        # Test health endpoint
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.log_test("Health Endpoint", True, f"Status: {data.get('status')}")
            else:
                self.log_test("Health Endpoint", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_test("Health Endpoint", False, str(e))
            return  # Don't test other endpoints if server isn't responding
        
        # Test job description endpoint
        try:
            response = requests.post(
                f"{self.base_url}/job/set-job-description",
                data={"job_text": "We are looking for a Python developer with FastAPI experience."},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                self.log_test("Job Description Storage", True, f"Chunks: {data.get('chunks_indexed', 'N/A')}")
            else:
                self.log_test("Job Description Storage", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Job Description Storage", False, str(e))
        
        # Test chat endpoint
        try:
            response = requests.post(
                f"{self.base_url}/chat/",
                json={"message": "What technologies should I know for this role?"},
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            if response.status_code == 200:
                data = response.json()
                self.log_test("Chat Endpoint", True, f"Reply length: {len(data.get('reply', ''))}")
            else:
                self.log_test("Chat Endpoint", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Chat Endpoint", False, str(e))

    def test_file_processing(self):
        """Test PDF processing capabilities"""
        print(f"\n{Colors.BLUE}=== TESTING FILE PROCESSING ==={Colors.END}")
        
        # Create a test PDF-like file
        test_file_content = b"Test resume content for PDF processing"
        test_file_path = Path("test_resume.txt")
        
        try:
            # Write test file
            with open(test_file_path, "wb") as f:
                f.write(test_file_content)
            
            # Test file upload
            with open(test_file_path, "rb") as f:
                files = {"file": ("test_resume.txt", f, "text/plain")}
                response = requests.post(
                    f"{self.base_url}/job/upload-resume",
                    files=files,
                    timeout=15
                )
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("File Upload", True, f"Status: {data.get('status')}")
            else:
                self.log_test("File Upload", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("File Upload", False, str(e))
        finally:
            # Clean up test file
            if test_file_path.exists():
                test_file_path.unlink()

    def test_generation_endpoints(self):
        """Test cover letter and email generation"""
        print(f"\n{Colors.BLUE}=== TESTING GENERATION ENDPOINTS ==={Colors.END}")
        
        # Test cover letter generation
        try:
            response = requests.post(
                f"{self.base_url}/generate/cover-letter",
                json={"job_id": "TechCorp", "extra_context": "Senior Python Developer"},
                headers={"Content-Type": "application/json"},
                timeout=20
            )
            if response.status_code == 200:
                data = response.json()
                content_length = len(data.get('content', ''))
                self.log_test("Cover Letter Generation", True, f"Content length: {content_length}")
            else:
                self.log_test("Cover Letter Generation", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Cover Letter Generation", False, str(e))
        
        # Test recruiter email generation
        try:
            response = requests.post(
                f"{self.base_url}/generate/recruiter-email",
                json={"job_id": "InnovateAI", "extra_context": "Machine Learning Engineer"},
                headers={"Content-Type": "application/json"},
                timeout=20
            )
            if response.status_code == 200:
                data = response.json()
                content_length = len(data.get('content', ''))
                self.log_test("Recruiter Email Generation", True, f"Content length: {content_length}")
            else:
                self.log_test("Recruiter Email Generation", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Recruiter Email Generation", False, str(e))

    def run_all_tests(self, test_api=True):
        """Run all tests"""
        print(f"{Colors.BLUE}{'='*50}")
        print("🚀 STARTING COMPLETE SYSTEM TEST")
        print(f"{'='*50}{Colors.END}")
        
        # Component tests (don't require server)
        self.test_imports()
        self.test_embeddings()
        self.test_vectorstore_creation()
        self.test_llm()
        
        if test_api:
            # API tests (require server to be running)
            if self.wait_for_server():
                self.test_api_endpoints()
                self.test_file_processing()
                self.test_generation_endpoints()
            else:
                print(f"{Colors.RED}❌ Server not responding, skipping API tests{Colors.END}")
        
        # Print summary
        self.print_summary()
        
    def print_summary(self):
        """Print test summary"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for _, success, _ in self.test_results if success)
        failed_tests = total_tests - passed_tests
        
        print(f"\n{Colors.BLUE}{'='*50}")
        print("📊 TEST SUMMARY")
        print(f"{'='*50}{Colors.END}")
        print(f"Total Tests: {total_tests}")
        print(f"{Colors.GREEN}Passed: {passed_tests}{Colors.END}")
        print(f"{Colors.RED}Failed: {failed_tests}{Colors.END}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print(f"\n{Colors.RED}❌ FAILED TESTS:{Colors.END}")
            for test_name, success, message in self.test_results:
                if not success:
                    print(f"  - {test_name}: {message}")
        
        overall_status = "✅ ALL TESTS PASSED" if failed_tests == 0 else "❌ SOME TESTS FAILED"
        color = Colors.GREEN if failed_tests == 0 else Colors.RED
        print(f"\n{color}{overall_status}{Colors.END}")

if __name__ == "__main__":
    tester = SystemTester()
    
    # Check if --no-api flag is provided
    test_api = "--no-api" not in sys.argv
    
    tester.run_all_tests(test_api=test_api)
