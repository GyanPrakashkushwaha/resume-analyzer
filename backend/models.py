from pydantic import BaseModel
from typing import Literal, Optional

class Tip(BaseModel):
    type: Literal["good", "improve"]
    tip: str
    explanation: Optional[str]
    
class Category(BaseModel): 
    score: int
    tips: list[Tip]
    
class Feedback(BaseModel):
    overallScore: int
    ATS: Category
    toneAndStyle: Category
    content: Category
    structure: Category
    skills: Category