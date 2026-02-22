# API Testing Guide

## Quick Start with curl

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Register a User
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

### 3. Login and Save Token
```bash
# Login
TOKEN=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login/json" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"
```

### 4. Create a Student (High Risk)
```bash
curl -X POST "http://localhost:8000/api/v1/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "roll_number": "2024CS001",
    "department": "Computer Science",
    "semester": 3,
    "phone": "+1234567890",
    "attendance_percentage": 65,
    "assessment_score": 55,
    "assignment_score": 60,
    "internal_marks": 58,
    "previous_semester_gpa": 6.2
  }'
```

### 5. Create a Student (Low Risk)
```bash
curl -X POST "http://localhost:8000/api/v1/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@university.edu",
    "roll_number": "2024CS002",
    "department": "Computer Science",
    "semester": 3,
    "phone": "+1234567891",
    "attendance_percentage": 92,
    "assessment_score": 88,
    "assignment_score": 90,
    "internal_marks": 85,
    "previous_semester_gpa": 8.5
  }'
```

### 6. Get All Students
```bash
curl -X GET "http://localhost:8000/api/v1/students" \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Filter Students by Risk Level
```bash
# Get high-risk students
curl -X GET "http://localhost:8000/api/v1/students?risk_level=High" \
  -H "Authorization: Bearer $TOKEN"

# Get medium-risk students
curl -X GET "http://localhost:8000/api/v1/students?risk_level=Medium" \
  -H "Authorization: Bearer $TOKEN"

# Get low-risk students
curl -X GET "http://localhost:8000/api/v1/students?risk_level=Low" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get Student by ID
```bash
# Replace with actual student ID
STUDENT_ID="your_student_id_here"

curl -X GET "http://localhost:8000/api/v1/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Update Student
```bash
# Replace with actual student ID
STUDENT_ID="your_student_id_here"

curl -X PUT "http://localhost:8000/api/v1/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_percentage": 80,
    "assessment_score": 75
  }'
```

### 10. Predict Dropout Risk (Standalone)
```bash
# High Risk Example
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

# Low Risk Example
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_percentage": 92,
    "assessment_score": 88,
    "assignment_score": 90,
    "internal_marks": 85,
    "previous_semester_gpa": 8.5
  }'

# Medium Risk Example
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_percentage": 75,
    "assessment_score": 70,
    "assignment_score": 72,
    "internal_marks": 68,
    "previous_semester_gpa": 7.0
  }'
```

### 11. Delete Student
```bash
# Replace with actual student ID
STUDENT_ID="your_student_id_here"

curl -X DELETE "http://localhost:8000/api/v1/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## Complete Test Flow Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:8000/api/v1"

echo "=== Student Dropout Prediction API Test ==="

# 1. Register
echo -e "\n1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User"
  }')
echo $REGISTER_RESPONSE | jq '.'

# 2. Login
echo -e "\n2. Logging in..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login/json" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }' | jq -r '.access_token')
echo "Token obtained: ${TOKEN:0:20}..."

# 3. Create High Risk Student
echo -e "\n3. Creating high-risk student..."
STUDENT1=$(curl -s -X POST "$API_URL/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "roll_number": "2024CS001",
    "department": "Computer Science",
    "semester": 3,
    "attendance_percentage": 65,
    "assessment_score": 55,
    "assignment_score": 60,
    "internal_marks": 58,
    "previous_semester_gpa": 6.2
  }')
echo $STUDENT1 | jq '.'
STUDENT1_ID=$(echo $STUDENT1 | jq -r '._id')

# 4. Create Low Risk Student
echo -e "\n4. Creating low-risk student..."
STUDENT2=$(curl -s -X POST "$API_URL/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@university.edu",
    "roll_number": "2024CS002",
    "department": "Computer Science",
    "semester": 3,
    "attendance_percentage": 92,
    "assessment_score": 88,
    "assignment_score": 90,
    "internal_marks": 85,
    "previous_semester_gpa": 8.5
  }')
echo $STUDENT2 | jq '.'

# 5. Get All Students
echo -e "\n5. Getting all students..."
curl -s -X GET "$API_URL/students" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. Standalone Prediction
echo -e "\n6. Testing standalone prediction..."
curl -s -X POST "$API_URL/predict" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_percentage": 75,
    "assessment_score": 70,
    "assignment_score": 72,
    "internal_marks": 68,
    "previous_semester_gpa": 7.0
  }' | jq '.'

# 7. Update Student
echo -e "\n7. Updating student (improving scores)..."
curl -s -X PUT "$API_URL/students/$STUDENT1_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_percentage": 85,
    "assessment_score": 75
  }' | jq '.'

# 8. Filter by Risk Level
echo -e "\n8. Getting high-risk students..."
curl -s -X GET "$API_URL/students?risk_level=High" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n=== Test Complete ==="
```

Make it executable:
```bash
chmod +x test_api.sh
./test_api.sh
```

## Python Testing with requests

```python
import requests
import json

API_URL = "http://localhost:8000/api/v1"

# 1. Register
response = requests.post(
    f"{API_URL}/auth/register",
    json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
)
print("Register:", response.json())

# 2. Login
response = requests.post(
    f"{API_URL}/auth/login/json",
    json={
        "username": "testuser",
        "password": "testpass123"
    }
)
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 3. Create Student
response = requests.post(
    f"{API_URL}/students",
    headers=headers,
    json={
        "name": "John Doe",
        "email": "john.doe@university.edu",
        "roll_number": "2024CS001",
        "department": "Computer Science",
        "semester": 3,
        "attendance_percentage": 65,
        "assessment_score": 55,
        "assignment_score": 60,
        "internal_marks": 58,
        "previous_semester_gpa": 6.2
    }
)
student = response.json()
print("Created Student:", json.dumps(student, indent=2))

# 4. Predict
response = requests.post(
    f"{API_URL}/predict",
    headers=headers,
    json={
        "attendance_percentage": 75,
        "assessment_score": 70,
        "assignment_score": 72,
        "internal_marks": 68,
        "previous_semester_gpa": 7.0
    }
)
prediction = response.json()
print("Prediction:", json.dumps(prediction, indent=2))
```

## Expected Outputs

### High Risk Student
```json
{
  "dropout_probability": 0.78,
  "risk_score": 78,
  "risk_level": "High",
  "risk_factors": [...]
}
```

### Medium Risk Student
```json
{
  "dropout_probability": 0.55,
  "risk_score": 55,
  "risk_level": "Medium",
  "risk_factors": [...]
}
```

### Low Risk Student
```json
{
  "dropout_probability": 0.15,
  "risk_score": 15,
  "risk_level": "Low",
  "risk_factors": [...]
}
```
