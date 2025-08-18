#!/usr/bin/env python3
"""
Database initialization script
"""
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.models import create_tables
from app.models.database import SessionLocal
from app.models.user import User
from app.core.auth import get_password_hash

def init_db():
    """Initialize the database with tables and default data"""
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    
    # Create a default admin user if it doesn't exist
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            print("Creating default admin user...")
            admin_user = User(
                email="admin@example.com",
                username="admin",
                full_name="Admin User",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            print("Default admin user created!")
            print("Email: admin@example.com")
            print("Password: admin123")
        else:
            print("Admin user already exists")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
