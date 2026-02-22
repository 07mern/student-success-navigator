# Quick Reference - Student Dropout Prediction API

## 🚀 Quick Start

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python models/create_sample_model.py
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs

## 📌 Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login/json` | Login | ❌ |
| POST | `/api/v1/students` | Create student + predict | ✅ |
| GET | `/api/v1/students` | List students | ✅ |
| GET | `/api/v1/students/{id}` | Get student | ✅ |
| PUT | `/api/v1/students/{id}` | Update student | ✅ |
| DELETE | `/api/v1/students/{id}` | Delete student | ✅ |
| POST | `/api/v1/predict` | Predict dropout risk | ✅ |

## 🔑 Authentication Flow

1. **Register**: POST `/api/v1/auth/register`
2. **Login**: POST `/api/v1/auth/login/json`
3. **Use Token**: Add header `Authorization: Bearer <token>`

## 📊 Risk Levels

| Score | Level | Action |
|-------|-------|--------|
| 0-40 | 🟢 Low | Monitor |
| 41-70 | 🟡 Medium | Counsel |
| 71-100 | 🔴 High | Urgent intervention |

## 🎯 Feature Importance

1. **attendance_percentage** (0-100)
2. **assessment_score** (0-100)
3. **assignment_score** (0-100)
4. **internal_marks** (0-100)
5. **previous_semester_gpa** (0-10)

## 🐳 Docker Quick Start

```bash
docker-compose up -d
```

## 🧪 Test Examples

### High Risk (Score: ~78)
```json
{
  "attendance_percentage": 65,
  "assessment_score": 55,
  "assignment_score": 60,
  "internal_marks": 58,
  "previous_semester_gpa": 6.2
}
```

### Medium Risk (Score: ~55)
```json
{
  "attendance_percentage": 75,
  "assessment_score": 70,
  "assignment_score": 72,
  "internal_marks": 68,
  "previous_semester_gpa": 7.0
}
```

### Low Risk (Score: ~15)
```json
{
  "attendance_percentage": 92,
  "assessment_score": 88,
  "assignment_score": 90,
  "internal_marks": 85,
  "previous_semester_gpa": 8.5
}
```

## 📝 Environment Variables

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=student_dropout_prediction
SECRET_KEY=your-secret-key-min-32-characters
MODEL_PATH=models/student_xgboost_model.pkl
```

## 🔧 Common Commands

```bash
# Start server
uvicorn app.main:app --reload

# Run with specific host/port
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Production (with workers)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Create model
python models/create_sample_model.py

# Run tests
./test_api.sh
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not found | Run `python models/create_sample_model.py` |
| MongoDB error | Check MongoDB is running: `systemctl status mongodb` |
| Auth error | Verify SECRET_KEY in .env |
| Import error | Activate venv: `source venv/bin/activate` |

## 📚 Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## 🎨 Response Format

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
    }
  ]
}
```

## 🔐 Security Notes

- Use strong SECRET_KEY (32+ chars)
- Change default credentials
- Use HTTPS in production
- Enable rate limiting
- Regular security updates
