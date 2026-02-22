from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from app.core.database import db


class StudentModel:
    """Student database operations."""
    
    collection_name = "students"
    
    @staticmethod
    async def create(student_data: dict) -> dict:
        """Create a new student."""
        student_data["created_at"] = datetime.utcnow()
        student_data["updated_at"] = datetime.utcnow()
        
        result = await db.db[StudentModel.collection_name].insert_one(student_data)
        student_data["_id"] = str(result.inserted_id)
        return student_data
    
    @staticmethod
    async def get_by_id(student_id: str) -> Optional[dict]:
        """Get student by ID."""
        if not ObjectId.is_valid(student_id):
            return None
        
        student = await db.db[StudentModel.collection_name].find_one({"_id": ObjectId(student_id)})
        if student:
            student["_id"] = str(student["_id"])
        return student
    
    @staticmethod
    async def get_by_roll_number(roll_number: str) -> Optional[dict]:
        """Get student by roll number."""
        student = await db.db[StudentModel.collection_name].find_one({"roll_number": roll_number})
        if student:
            student["_id"] = str(student["_id"])
        return student
    
    @staticmethod
    async def get_all(skip: int = 0, limit: int = 100, filters: dict = None) -> List[dict]:
        """Get all students with pagination and filters."""
        query = filters if filters else {}
        
        cursor = db.db[StudentModel.collection_name].find(query).skip(skip).limit(limit)
        students = await cursor.to_list(length=limit)
        
        for student in students:
            student["_id"] = str(student["_id"])
        
        return students
    
    @staticmethod
    async def update(student_id: str, update_data: dict) -> Optional[dict]:
        """Update student information."""
        if not ObjectId.is_valid(student_id):
            return None
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.db[StudentModel.collection_name].update_one(
            {"_id": ObjectId(student_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await StudentModel.get_by_id(student_id)
        return None
    
    @staticmethod
    async def delete(student_id: str) -> bool:
        """Delete a student."""
        if not ObjectId.is_valid(student_id):
            return False
        
        result = await db.db[StudentModel.collection_name].delete_one({"_id": ObjectId(student_id)})
        return result.deleted_count > 0
    
    @staticmethod
    async def count(filters: dict = None) -> int:
        """Count students matching filters."""
        query = filters if filters else {}
        return await db.db[StudentModel.collection_name].count_documents(query)
    
    @staticmethod
    async def get_by_risk_level(risk_level: str, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get students by risk level."""
        return await StudentModel.get_all(
            skip=skip,
            limit=limit,
            filters={"risk_level": risk_level}
        )
