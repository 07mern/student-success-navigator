#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Student Dropout Prediction API...${NC}"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Running setup...${NC}"
    ./setup.sh
fi

# Activate virtual environment
source venv/bin/activate

# Start the server
echo -e "\n${GREEN}Starting Uvicorn server...${NC}"
echo -e "API: http://localhost:8000"
echo -e "Docs: http://localhost:8000/docs"
echo -e "ReDoc: http://localhost:8000/redoc"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
