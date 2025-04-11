# Use a simple Python image for both architectures
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install FastAPI and Uvicorn
RUN pip install fastapi uvicorn

# Copy the FastAPI app
COPY main.py .

# Expose port 8000
EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
