@echo off
cd backend
pip install fastapi uvicorn
start cmd /k uvicorn main:app --reload
cd ../frontend
start index.html
