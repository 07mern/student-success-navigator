#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Student Dropout Prediction System - Setup Script${NC}"
echo "=================================================="

# Check Python version
echo -e "\n${YELLOW}Checking Python version...${NC}"
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "\n${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "\n${GREEN}✓ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo -e "\n${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "\n${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
else
    echo -e "\n${GREEN}✓ .env file already exists${NC}"
fi

# Check if model file exists
if [ ! -f "models/student_xgboost_model.pkl" ]; then
    echo -e "\n${YELLOW}Model file not found. Creating sample model...${NC}"
    cd models
    python create_sample_model.py
    cd ..
    echo -e "${GREEN}✓ Sample model created${NC}"
else
    echo -e "\n${GREEN}✓ Model file already exists${NC}"
fi

# Check MongoDB connection
echo -e "\n${YELLOW}Checking MongoDB connection...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found. Please install MongoDB or use MongoDB Atlas${NC}"
fi

echo -e "\n${GREEN}=================================================="
echo "Setup complete! 🎉"
echo "=================================================="
echo -e "\nTo start the server, run:"
echo -e "${YELLOW}  source venv/bin/activate${NC}"
echo -e "${YELLOW}  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000${NC}"
echo -e "\nOr use the start script:"
echo -e "${YELLOW}  ./start_server.sh${NC}"
echo -e "\nAPI will be available at:"
echo -e "  http://localhost:8000"
echo -e "  http://localhost:8000/docs (Interactive API docs)"
echo ""
