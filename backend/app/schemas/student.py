from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime


class StudentFeatures(BaseModel):
    """Base features for prediction."""
    attendance_percentage: float = Field(..., ge=0, le=100, description="Attendance percentage (0-100)")
    assessment_score: float = Field(..., ge=0, le=100, description="Assessment score (0-100)")
    assignment_score: float = Field(..., ge=0, le=100, description="Assignment score (0-100)")
    internal_marks: float = Field(..., ge=0, le=100, description="Internal marks (0-100)")
    previous_semester_gpa: float = Field(..., ge=0, le=10, description="Previous semester GPA (0-10)")


class StudentBase(BaseModel):
    """Base student information."""
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., description="Student email address")
    roll_number: str = Field(..., min_length=3, max_length=50, description="Unique roll number")
    department: str = Field(..., min_length=2, max_length=100)
    semester: int = Field(..., ge=1, le=8, description="Current semester (1-8)")
    phone: Optional[str] = Field(None, max_length=20)


class StudentCreate(StudentBase, StudentFeatures):
    """Schema for creating a new student."""
    pass


class StudentUpdate(BaseModel):
    """Schema for updating student information."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = None
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    semester: Optional[int] = Field(None, ge=1, le=8)
    phone: Optional[str] = Field(None, max_length=20)
    attendance_percentage: Optional[float] = Field(None, ge=0, le=100)
    assessment_score: Optional[float] = Field(None, ge=0, le=100)
    assignment_score: Optional[float] = Field(None, ge=0, le=100)
    internal_marks: Optional[float] = Field(None, ge=0, le=100)
    previous_semester_gpa: Optional[float] = Field(None, ge=0, le=10)


class RiskFactor(BaseModel):
    """Individual risk factor."""
    feature: str
    value: float
    importance: float
    explanation: str


class PredictionResult(BaseModel):
    """Prediction result with risk analysis."""
    dropout_probability: float = Field(..., description="Probability of dropout (0-1)")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score (0-100)")
    risk_level: str = Field(..., description="Risk level: Low, Medium, or High")
    risk_factors: List[RiskFactor] = Field(..., description="Top 3 contributing risk factors")


class Student(StudentBase, StudentFeatures):
    """Complete student schema with predictions."""
    id: str = Field(..., alias="_id")
    dropout_probability: Optional[float] = None
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "name": "John Doe",
                "email": "john.doe@university.edu",
                "roll_number": "2021CS001",
                "department": "Computer Science",
                "semester": 4,
                "phone": "+1234567890",
                "attendance_percentage": 85.5,
                "assessment_score": 78.0,
                "assignment_score": 82.5,
                "internal_marks": 75.0,
                "previous_semester_gpa": 7.8,
                "dropout_probability": 0.25,
                "risk_score": 25,
                "risk_level": "Low",
                "created_at": "2024-01-15T10:30:00",
                "updated_at": "2024-01-15T10:30:00"
            }
        }


class PredictionRequest(StudentFeatures):
    """Request schema for standalone prediction."""
    pass


class PredictionResponse(PredictionResult):
    """Response schema for standalone prediction."""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "dropout_probability": 0.78,
                "risk_score": 78,
                "risk_level": "High",
                "risk_factors": [
                    {
                        "feature": "Attendance Percentage",
                        "value": 65.0,
                        "importance": 0.35,
                        "explanation": "Low attendance (65%) - Below required 75%"
                    },
                    {
                        "feature": "Assessment Score",
                        "value": 55.0,
                        "importance": 0.28,
                        "explanation": "Assessment Score is low (55) - Below passing threshold"
                    },
                    {
                        "feature": "Previous Semester GPA",
                        "value": 6.2,
                        "importance": 0.22,
                        "explanation": "Previous GPA at 6.2 - Maintain consistency"
                    }
                ],
                "timestamp": "2024-01-15T10:30:00"
            }
        }
