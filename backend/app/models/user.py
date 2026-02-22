from datetime import datetime
from typing import Optional
from bson import ObjectId
from app.core.database import db


class UserModel:
    """User database operations."""
    
    collection_name = "users"
    
    @staticmethod
    async def create(user_data: dict) -> dict:
        """Create a new user."""
        user_data["created_at"] = datetime.utcnow().isoformat()
        user_data["is_active"] = True
        
        result = await db.db[UserModel.collection_name].insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        return user_data
    
    @staticmethod
    async def get_by_username(username: str) -> Optional[dict]:
        """Get user by username."""
        user = await db.db[UserModel.collection_name].find_one({"username": username})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    async def get_by_email(email: str) -> Optional[dict]:
        """Get user by email."""
        user = await db.db[UserModel.collection_name].find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    async def get_by_id(user_id: str) -> Optional[dict]:
        """Get user by ID."""
        if not ObjectId.is_valid(user_id):
            return None
        
        user = await db.db[UserModel.collection_name].find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
        return user
