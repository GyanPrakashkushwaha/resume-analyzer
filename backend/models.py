from pydantic import BaseModel, Field
from typing import Literal, Optional, List

class Tip(BaseModel):
    type: Literal["good", "improve"] = Field(description="Whether this is positive feedback or a critical improvement needed.")
    tip: str = Field(description="The specific issue or action item. E.g., 'Missing keyword: Kubernetes' or 'Rewrite the API bullet point'.")
    explanation: Optional[str] = Field(default=None, description="The EXACT text the user should add or change. Do not give general advice. Provide the specific sentence or keyword list based on the Job Description.")

class Category(BaseModel):
    score: int = Field(description="Score for this category (0-100).", ge=0, le=100)
    tips: List[Tip] = Field(description="List of specific, actionable tips.")

class Feedback(BaseModel):
    overallScore: int = Field(description="Overall score (0-100).", ge=0, le=100)
    ATS: Category = Field(description="ATS optimization based on specific keywords found in the Job Description but missing in the Resume.")
    toneAndStyle: Category = Field(description="Feedback on action verbs and professional phrasing.")
    content: Category = Field(description="Feedback on how well the projects/experience match the specific requirements of the Job Description.")
    structure: Category = Field(description="Organization and layout feedback.")
    skills: Category = Field(description="Feedback on technical/soft skills gaps between the Resume and Job Description.")