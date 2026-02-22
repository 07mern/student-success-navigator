"""
Script to create a sample XGBoost model for demonstration purposes.

This creates a simple trained model that can be used for testing the API.
In production, replace this with your actual trained model.
"""

import numpy as np
import pandas as pd
from xgboost import XGBClassifier
import joblib
from pathlib import Path


def create_sample_model():
    """
    Create a sample XGBoost model trained on synthetic data.
    """
    print("Creating sample XGBoost model...")
    
    # Create synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    # Features
    attendance = np.random.uniform(40, 100, n_samples)
    assessment = np.random.uniform(30, 100, n_samples)
    assignment = np.random.uniform(30, 100, n_samples)
    internal_marks = np.random.uniform(30, 100, n_samples)
    previous_gpa = np.random.uniform(4, 10, n_samples)
    
    # Create target variable (dropout) based on features
    # Lower values indicate higher dropout risk
    risk_score = (
        (100 - attendance) * 0.30 +
        (100 - assessment) * 0.25 +
        (100 - assignment) * 0.20 +
        (100 - internal_marks) * 0.15 +
        (10 - previous_gpa) * 10 * 0.10
    )
    
    # Add some noise
    risk_score += np.random.normal(0, 10, n_samples)
    
    # Convert to binary classification (1 = dropout, 0 = no dropout)
    threshold = np.percentile(risk_score, 70)  # Top 30% are at risk
    dropout = (risk_score > threshold).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'attendance_percentage': attendance,
        'assessment_score': assessment,
        'assignment_score': assignment,
        'internal_marks': internal_marks,
        'previous_semester_gpa': previous_gpa,
        'dropout': dropout
    })
    
    # Prepare features and target
    feature_columns = [
        'attendance_percentage',
        'assessment_score',
        'assignment_score',
        'internal_marks',
        'previous_semester_gpa'
    ]
    
    X = df[feature_columns]
    y = df['dropout']
    
    # Train XGBoost model
    model = XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss'
    )
    
    print("Training model...")
    model.fit(X, y)
    
    # Save model
    model_path = Path(__file__).parent / 'student_xgboost_model.pkl'
    joblib.dump(model, model_path)
    
    print(f"Model saved to: {model_path}")
    print("\nModel Statistics:")
    print(f"- Number of samples: {n_samples}")
    print(f"- Number of features: {len(feature_columns)}")
    print(f"- Dropout rate: {(dropout.sum() / len(dropout)) * 100:.2f}%")
    print(f"- Model accuracy on training data: {model.score(X, y) * 100:.2f}%")
    
    # Test prediction
    print("\nTesting sample prediction:")
    test_sample = pd.DataFrame([{
        'attendance_percentage': 65.0,
        'assessment_score': 55.0,
        'assignment_score': 60.0,
        'internal_marks': 58.0,
        'previous_semester_gpa': 6.2
    }])
    
    prediction = model.predict_proba(test_sample)[0]
    print(f"Sample dropout probability: {prediction[1]:.4f}")
    
    return model


if __name__ == "__main__":
    model = create_sample_model()
    print("\n✅ Sample model created successfully!")
    print("You can now start the API server.")
