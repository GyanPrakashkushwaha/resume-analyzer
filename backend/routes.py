from fastapi import APIRouter, UploadFile, Form
from base64 import b64encode
from utils import analyze_resume

router = APIRouter()

@router.post('/analyze')
async def analyze(
    f: UploadFile, 
    job_title: str = Form(""),      
    job_description: str = Form("")  
):
    file_bytes = await f.read()
    img_b64 = b64encode(file_bytes).decode("utf-8")
    
    # This returns the Pydantic model, which FastAPI will automatically convert to JSON
    analyzer = analyze_resume(
        job_title=job_title, 
        job_description=job_description, 
        image_data=img_b64
    )
    
    return {"res": analyzer}