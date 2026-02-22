from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "student_dropout_prediction"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Student Dropout Prediction System"
    DEBUG: bool = True
    
    # Model
    MODEL_PATH: str = "models/student_xgboost_model.pkl"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000"
    ]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
