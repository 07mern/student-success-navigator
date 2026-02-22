from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.student import PredictionRequest, PredictionResponse, RiskFactor
from app.schemas.user import User
from app.services.ml_service import ml_service
from app.utils.dependencies import get_current_active_user

router = APIRouter()


@router.post("", response_model=PredictionResponse)
async def predict_dropout(
    prediction_input: PredictionRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Predict dropout probability for given student features.
    
    Returns:
    - dropout_probability: Probability of dropout (0-1)
    - risk_score: Risk score (0-100)
    - risk_level: Risk classification (Low/Medium/High)
    - risk_factors: Top 3 contributing factors with explanations
    """
    try:
        # Prepare features
        features = {
            "attendance_percentage": prediction_input.attendance_percentage,
            "assessment_score": prediction_input.assessment_score,
            "assignment_score": prediction_input.assignment_score,
            "internal_marks": prediction_input.internal_marks,
            "previous_semester_gpa": prediction_input.previous_semester_gpa
        }
        
        # Get prediction
        dropout_prob, risk_score, risk_level = ml_service.predict_dropout_probability(features)
        
        # Get feature importance (top 3 risk factors)
        top_features = ml_service.get_feature_importance(features)
        
        # Generate explanations
        explanations = ml_service.get_risk_explanation(top_features)
        
        # Format risk factors with explanations
        risk_factors = []
        for i, factor in enumerate(top_features):
            risk_factors.append(
                RiskFactor(
                    feature=factor["feature"],
                    value=factor["value"],
                    importance=factor["importance"],
                    explanation=explanations[i] if i < len(explanations) else ""
                )
            )
        
        return PredictionResponse(
            dropout_probability=dropout_prob,
            risk_score=risk_score,
            risk_level=risk_level,
            risk_factors=risk_factors
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during prediction: {str(e)}"
        )
