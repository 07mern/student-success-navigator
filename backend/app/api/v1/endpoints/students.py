from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.student import StudentCreate, Student, StudentUpdate
from app.schemas.user import User
from app.models.student import StudentModel
from app.services.ml_service import ml_service
from app.utils.dependencies import get_current_active_user

router = APIRouter()


@router.post("", response_model=Student, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_in: StudentCreate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new student and auto-predict dropout risk using XGBoost.
    """
    # Check if roll number already exists
    existing_student = await StudentModel.get_by_roll_number(student_in.roll_number)
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student with this roll number already exists"
        )
    
    # Prepare student data
    student_data = student_in.model_dump()
    
    # Predict dropout risk
    try:
        features = {
            "attendance_percentage": student_in.attendance_percentage,
            "assessment_score": student_in.assessment_score,
            "assignment_score": student_in.assignment_score,
            "internal_marks": student_in.internal_marks,
            "previous_semester_gpa": student_in.previous_semester_gpa
        }
        
        dropout_prob, risk_score, risk_level = ml_service.predict_dropout_probability(features)
        
        student_data["dropout_probability"] = dropout_prob
        student_data["risk_score"] = risk_score
        student_data["risk_level"] = risk_level
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error predicting dropout risk: {str(e)}"
        )
    
    # Create student
    created_student = await StudentModel.create(student_data)
    
    return Student(**created_student)


@router.get("", response_model=List[Student])
async def get_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    risk_level: Optional[str] = Query(None, regex="^(Low|Medium|High)$"),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all students with risk scores. Supports filtering by risk level.
    """
    filters = {}
    if risk_level:
        filters["risk_level"] = risk_level
    
    students = await StudentModel.get_all(skip=skip, limit=limit, filters=filters)
    return [Student(**student) for student in students]


@router.get("/{student_id}", response_model=Student)
async def get_student(
    student_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a specific student by ID.
    """
    student = await StudentModel.get_by_id(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return Student(**student)


@router.put("/{student_id}", response_model=Student)
async def update_student(
    student_id: str,
    student_update: StudentUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Update student information and recalculate risk if academic data changed.
    """
    # Check if student exists
    existing_student = await StudentModel.get_by_id(student_id)
    if not existing_student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Prepare update data
    update_data = student_update.model_dump(exclude_unset=True)
    
    # Check if academic features were updated
    academic_features = [
        "attendance_percentage",
        "assessment_score",
        "assignment_score",
        "internal_marks",
        "previous_semester_gpa"
    ]
    
    academic_updated = any(key in update_data for key in academic_features)
    
    if academic_updated:
        # Get current features and update with new values
        features = {
            "attendance_percentage": update_data.get("attendance_percentage", existing_student.get("attendance_percentage")),
            "assessment_score": update_data.get("assessment_score", existing_student.get("assessment_score")),
            "assignment_score": update_data.get("assignment_score", existing_student.get("assignment_score")),
            "internal_marks": update_data.get("internal_marks", existing_student.get("internal_marks")),
            "previous_semester_gpa": update_data.get("previous_semester_gpa", existing_student.get("previous_semester_gpa"))
        }
        
        try:
            dropout_prob, risk_score, risk_level = ml_service.predict_dropout_probability(features)
            
            update_data["dropout_probability"] = dropout_prob
            update_data["risk_score"] = risk_score
            update_data["risk_level"] = risk_level
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error predicting dropout risk: {str(e)}"
            )
    
    # Update student
    updated_student = await StudentModel.update(student_id, update_data)
    if not updated_student:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update student"
        )
    
    return Student(**updated_student)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a student.
    """
    success = await StudentModel.delete(student_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    return None
