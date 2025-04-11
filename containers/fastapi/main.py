from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FastAPI is running and supports both AMD64 and ARM64 architectures"}

@app.get("/health")
async def health():
    return {"status": "ok"}
