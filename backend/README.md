# AI-Based Student Dropout Prediction & Counseling System - Backend

A production-ready FastAPI backend that integrates a pre-trained XGBoost model to predict student dropout probability and provide actionable insights with explainable AI.

## 🚀 Features

- **🔐 JWT Authentication**: Secure user registration and login
- **👨‍🎓 Student Management**: CRUD operations with automatic risk assessment
- **🤖 ML Predictions**: Real-time dropout prediction using XGBoost
- **📊 Risk Scoring**: 0-100 risk score with Low/Medium/High classification
- **🎯 Explainable AI**: Top 3 contributing risk factors with explanations
- **📈 Feature Importance**: Identify key factors affecting predictions
- **🗄️ MongoDB Integration**: Async database operations with Motor
- **📚 Auto Documentation**: Interactive API docs (Swagger UI & ReDoc)

## 🛠️ Tech Stack

- **FastAPI** - Modern async web framework
- **MongoDB** - NoSQL database with Motor (async driver)
- **XGBoost** - Machine learning model for predictions
- **JWT** - JSON Web Tokens for authentication
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server
- **Joblib** - Model serialization
- **Pandas** - Data manipulation

## 📋 Prerequisites

- Python 3.9+
- MongoDB 4.4+ (local or cloud instance)
- pip or pipenv

## 🔧 Installation

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=student_dropout_prediction

# JWT Configuration
SECRET_KEY=your-super-secret-key-here-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Student Dropout Prediction System
DEBUG=True

# Model Configuration
MODEL_PATH=models/student_xgboost_model.pkl

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:8000"]
```

### 5. Set up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string and update `MONGODB_URL` in `.env`

### 6. Create sample model (for testing)

```bash
cd models
python create_sample_model.py
```

This creates a sample trained XGBoost model. **Replace with your actual trained model in production!**

### 7. Start the server

```bash
# From backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py          # Authentication endpoints
│   │       │   ├── students.py      # Student CRUD endpoints
│   │       │   └── predict.py       # Prediction endpoint
│   │       └── api.py               # API router configuration
│   ├── core/
│   │   ├── config.py                # Application settings
│   │   ├── security.py              # JWT and password hashing
│   │   └── database.py              # MongoDB connection
│   ├── models/
│   │   ├── user.py                  # User database operations
│   │   └── student.py               # Student database operations
│   ├── schemas/
│   │   ├── user.py                  # User Pydantic schemas
│   │   └── student.py               # Student Pydantic schemas
│   ├── services/
│   │   └── ml_service.py            # XGBoost model service
│   ├── utils/
│   │   └── dependencies.py          # FastAPI dependencies
│   └── main.py                      # FastAPI application entry point
├── models/
│   ├── create_sample_model.py       # Script to create sample model
│   └── student_xgboost_model.pkl    # Trained XGBoost model
├── tests/                           # Test files (to be implemented)
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "full_name": "John Doe"
}
```

#### Login (Form)
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=john_doe&password=secure_password
```

#### Login (JSON)
```http
POST /api/v1/auth/login/json
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Student Management

All student endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

#### Create Student
```http
POST /api/v1/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@university.edu",
  "roll_number": "2024CS001",
  "department": "Computer Science",
  "semester": 3,
  "phone": "+1234567890",
  "attendance_percentage": 85.5,
  "assessment_score": 78.0,
  "assignment_score": 82.5,
  "internal_marks": 75.0,
  "previous_semester_gpa": 7.8
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Jane Smith",
  "email": "jane.smith@university.edu",
  "roll_number": "2024CS001",
  "department": "Computer Science",
  "semester": 3,
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
```

#### Get All Students
```http
GET /api/v1/students?skip=0&limit=100&risk_level=High
Authorization: Bearer <token>
```

#### Get Student by ID
```http
GET /api/v1/students/{student_id}
Authorization: Bearer <token>
```

#### Update Student
```http
PUT /api/v1/students/{student_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "attendance_percentage": 90.0,
  "assessment_score": 85.0
}
```

#### Delete Student
```http
DELETE /api/v1/students/{student_id}
Authorization: Bearer <token>
```

### Prediction API

#### Predict Dropout Risk
```http
POST /api/v1/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "attendance_percentage": 65,
  "assessment_score": 55,
  "assignment_score": 60,
  "internal_marks": 58,
  "previous_semester_gpa": 6.2
}
```

**Response:**
```json
{
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
```

## 🤖 Model Integration

### Expected Input Features

The model expects these 5 features for prediction:

1. **attendance_percentage** (0-100): Student's attendance percentage
2. **assessment_score** (0-100): Average assessment/test scores
3. **assignment_score** (0-100): Assignment completion scores
4. **internal_marks** (0-100): Internal evaluation marks
5. **previous_semester_gpa** (0-10): Previous semester GPA

### Risk Calculation Logic

1. **Prediction**: Model's `predict_proba()` returns dropout probability
2. **Risk Score**: Probability × 100 (0-100 scale)
3. **Risk Level**:
   - 0-40: **Low Risk** ✅
   - 41-70: **Medium Risk** ⚠️
   - 71-100: **High Risk** 🚨

### Explainable AI

The system provides:
- **Feature Importance**: From XGBoost model
- **Top 3 Risk Factors**: Features contributing most to the prediction
- **Explanations**: Human-readable reasons for each risk factor

## 🔒 Security

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: HS256 algorithm with configurable expiration
- **Input Validation**: Pydantic schemas validate all inputs
- **CORS**: Configurable cross-origin resource sharing
- **Environment Variables**: Sensitive data in environment variables

## 🧪 Testing

### Manual Testing with curl

1. **Register a user:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User"
  }'
```

2. **Login:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login/json" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

3. **Use token for authenticated requests:**
```bash
TOKEN="your_access_token_here"

curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_percentage": 65,
    "assessment_score": 55,
    "assignment_score": 60,
    "internal_marks": 58,
    "previous_semester_gpa": 6.2
  }'
```

### Using Interactive Docs

Visit http://localhost:8000/docs for interactive API documentation where you can test all endpoints directly.

## 📊 Monitoring and Logging

The application includes:
- Startup/shutdown event logging
- Database connection status
- Model loading confirmation
- Request/response logging (in DEBUG mode)

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
DEBUG=False
SECRET_KEY=<strong-random-secret-key>
MONGODB_URL=<production-mongodb-url>
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
```

### 2. Use Production ASGI Server

```bash
# Using Gunicorn with Uvicorn workers
pip install gunicorn

gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### 3. Deploy with Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t student-dropout-api .
docker run -p 8000:8000 --env-file .env student-dropout-api
```

## 🔄 Model Updates

To update the XGBoost model:

1. Train your new model with the same feature names
2. Save it using joblib:
   ```python
   import joblib
   joblib.dump(model, 'student_xgboost_model.pkl')
   ```
3. Replace the model file in `models/` directory
4. Restart the API server

The model is loaded once at startup for optimal performance.

## 🐛 Troubleshooting

### Model not loading
- Ensure `student_xgboost_model.pkl` exists in the `models/` directory
- Check file permissions
- Run `create_sample_model.py` to create a test model

### MongoDB connection failed
- Verify MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in `.env`
- Ensure network connectivity to MongoDB server

### Authentication errors
- Verify `SECRET_KEY` is set in `.env`
- Check token expiration time
- Ensure user exists in database

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Motor Documentation](https://motor.readthedocs.io/)

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ✨ Authors

Built with ❤️ for the Student Success Initiative

---

**Happy Coding! 🚀**
