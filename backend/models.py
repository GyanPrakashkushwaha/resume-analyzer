from pydantic import BaseModel, Field
 typing import Literal, Optional, List

class Tip(BaseModel):
    type: Literal["good", "improve"] = Field(description="Whether this is positive feedback ('good') or a suggestion to improve ('improve').")
    tip: str = Field(description="A short, specific point of feedback about the resume.")
    explanation: Optional[str] = Field(default=None,description="A more detailed explanation or example for this tip (optional).")
    
class Category(BaseModel):
    score: int = Field(description="Score for this specific category (e.g., ATS, content, tone), typically on a 0–10 scale.")
    tips: List[Tip] = Field(description="List of tips related to this category, including what is good and what should be improved.")
    
class Feedback(BaseModel):
    overallScore: int = Field(description="Overall score for the resume considering all aspects, typically on a 0–10 scale.")
    ATS: Category = Field(description="How well the resume is optimized for ATS (keywords, formatting, parsing friendliness).")
    toneAndStyle: Category = Field(description="Quality of tone and writing style: clarity, professionalism, conciseness, and consistency.")
    content: Category = Field(description="Relevance and completeness of the information: experience, projects, achievements, and impact.")
    structure: Category = Field(description="Organization and layout of the resume: sections, readability, and overall flow.")
    skills: Category = Field(description="Match and clarity of technical and soft skills relative to the job description.")
