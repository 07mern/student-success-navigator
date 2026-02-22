from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    print("Starting up...")
    await connect_to_mongo()
    print("Application started successfully!")
    
    yield
    
    # Shutdown
    print("Shutting down...")
    await close_mongo_connection()
    print("Application shut down successfully!")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    version="1.0.0",
    description="""
    ## AI-Based Student Dropout Prediction & Counseling System
    
    A production-ready backend system that integrates a pre-trained XGBoost model 
    to predict student dropout probability and provide actionable insights.
    
    ### Features:
    - 🔐 JWT-based authentication
    - 👨‍🎓 Student management with automatic risk assessment
    - 🤖 Real-time dropout prediction with explainable AI
    - 📊 Risk scoring and classification (Low/Medium/High)
    - 🎯 Top contributing risk factors identification
    - 📈 Feature importance analysis
    
    ### Tech Stack:
    - FastAPI
    - MongoDB (Motor)
    - XGBoost
    - JWT Authentication
    - Pydantic
    """
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Student Dropout Prediction System API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Student Dropout Prediction System"
    }
