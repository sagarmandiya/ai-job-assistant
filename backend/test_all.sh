#!/bin/bash

echo "🚀 Starting Complete Backend Test Workflow"
echo "=========================================="

# Step 1: Quick dry run (no server needed)
echo "📋 Step 1: Quick Dry Run"
python dry_run.py

echo -e "\n⏸️  Press Enter to continue with server tests, or Ctrl+C to exit..."
read

# Step 2: Start server in background
echo "🌐 Step 2: Starting Server"
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Step 3: Run complete tests
echo "🧪 Step 3: Running Complete Tests"
python test_complete_system.py

# Step 4: Cleanup
echo "🧹 Step 4: Cleanup"
kill $SERVER_PID
echo "Server stopped."

echo "✅ All tests completed!"
