#!/bin/bash
echo "🚀 Starting AI Job Assistant Platform Development"

# Start backend
cd backend
conda activate job_assistant
~/anaconda3/envs/job_assistant/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
