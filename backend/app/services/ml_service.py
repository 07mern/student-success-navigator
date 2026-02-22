import joblib
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from pathlib import Path
from app.core.config import settings


class MLModelService:
    """Service for loading and using the XGBoost model for predictions."""
    
    def __init__(self):
        self.model = None
        self.feature_names = [
            "attendance_percentage",
            "assessment_score",
            "assignment_score",
            "internal_marks",
            "previous_semester_gpa"
        ]
        self.load_model()
    
    def load_model(self):
        """Load the pre-trained XGBoost model."""
        try:
            model_path = Path(settings.MODEL_PATH)
            if model_path.exists():
                self.model = joblib.load(model_path)
                print(f"Model loaded successfully from {model_path}")
            else:
                print(f"Warning: Model file not found at {model_path}")
                print("Predictions will not be available until model is provided.")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
    
    def predict_dropout_probability(self, features: Dict[str, float]) -> Tuple[float, int, str]:
        """
        Predict dropout probability for a student.
        
        Args:
            features: Dictionary containing student features
            
        Returns:
            Tuple of (dropout_probability, risk_score, risk_level)
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please ensure the model file exists.")
        
        # Prepare input data
        input_data = pd.DataFrame([features])[self.feature_names]
        
        # Get prediction probabilities
        # predict_proba returns [probability_not_dropout, probability_dropout]
        proba = self.model.predict_proba(input_data)[0]
        dropout_probability = float(proba[1])  # Probability of dropout
        
        # Calculate risk score (0-100)
        risk_score = int(dropout_probability * 100)
        
        # Determine risk level
        if risk_score <= 40:
            risk_level = "Low"
        elif risk_score <= 70:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return dropout_probability, risk_score, risk_level
    
    def get_feature_importance(self, features: Dict[str, float]) -> List[Dict[str, any]]:
        """
        Get top contributing features using feature importance from the model.
        
        Args:
            features: Dictionary containing student features
            
        Returns:
            List of top 3 risk factors with their importance
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please ensure the model file exists.")
        
        # Get feature importances from the model
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
        else:
            # Fallback for models without feature_importances_
            importances = np.ones(len(self.feature_names)) / len(self.feature_names)
        
        # Calculate weighted importance based on actual values
        weighted_importance = []
        for i, feature_name in enumerate(self.feature_names):
            feature_value = features.get(feature_name, 0)
            
            # Normalize feature value (lower values indicate higher risk)
            if feature_name == "attendance_percentage":
                normalized_risk = (100 - feature_value) / 100
            elif feature_name == "assessment_score":
                normalized_risk = (100 - feature_value) / 100
            elif feature_name == "assignment_score":
                normalized_risk = (100 - feature_value) / 100
            elif feature_name == "internal_marks":
                normalized_risk = (100 - feature_value) / 100
            elif feature_name == "previous_semester_gpa":
                normalized_risk = (10 - feature_value) / 10
            else:
                normalized_risk = 0.5
            
            # Weight by model's feature importance
            weighted_score = importances[i] * normalized_risk
            
            weighted_importance.append({
                "feature": self._format_feature_name(feature_name),
                "value": feature_value,
                "importance": float(importances[i]),
                "weighted_score": float(weighted_score)
            })
        
        # Sort by weighted score and return top 3
        weighted_importance.sort(key=lambda x: x['weighted_score'], reverse=True)
        
        return weighted_importance[:3]
    
    def _format_feature_name(self, feature_name: str) -> str:
        """Format feature name for display."""
        name_map = {
            "attendance_percentage": "Attendance Percentage",
            "assessment_score": "Assessment Score",
            "assignment_score": "Assignment Score",
            "internal_marks": "Internal Marks",
            "previous_semester_gpa": "Previous Semester GPA"
        }
        return name_map.get(feature_name, feature_name)
    
    def get_risk_explanation(self, risk_factors: List[Dict[str, any]]) -> List[str]:
        """
        Generate human-readable explanations for risk factors.
        
        Args:
            risk_factors: List of top risk factors
            
        Returns:
            List of explanation strings
        """
        explanations = []
        
        for factor in risk_factors:
            feature = factor['feature']
            value = factor['value']
            
            if "Attendance" in feature:
                if value < 75:
                    explanations.append(f"Low attendance ({value}%) - Below required 75%")
                else:
                    explanations.append(f"Attendance at {value}% - Could be improved")
            elif "Assessment" in feature or "Assignment" in feature or "Internal" in feature:
                if value < 60:
                    explanations.append(f"{feature} is low ({value}) - Below passing threshold")
                else:
                    explanations.append(f"{feature} at {value} - Room for improvement")
            elif "GPA" in feature:
                if value < 6.0:
                    explanations.append(f"Low previous GPA ({value}) - Academic support needed")
                else:
                    explanations.append(f"Previous GPA at {value} - Maintain consistency")
        
        return explanations


# Global instance
ml_service = MLModelService()
