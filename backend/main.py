from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from routes import router
import shutil
import os

app = FastAPI()

app.include_router(router, prefix='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "BACKEND IS RUNNING BROOOOOOOOOOOOOOOOOO"}

UPLOAD_DIR = "uploads"   # folder to store files
os.makedirs(UPLOAD_DIR, exist_ok=True)



@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print("uploading the file")

    return {"message": "File uploaded successfully!", "filename": file.filename}