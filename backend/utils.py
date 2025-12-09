from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from models import Feedback
from dotenv import load_dotenv
import json

if not load_dotenv():
    raise Exception("Incorrect/unavailable **API KEY**")

def analyze_resume(job_title, job_description, image_data):
    # model initialization 
    llm = ChatGoogleGenerativeAI(
        model = "models/gemini-2.5-flash",
        temperature = 0,
    )
    
    # Structured output
    structured_llm = llm.with_structured_output(Feedback)
    print("LLM Calling...")
    # Prompt
    prompt_text = f"""
You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Please analyze and rate this resume and suggest how to improve it.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      If available, use the job description for the job user is applying to to give more detailed feedback.
      If provided, take the job description into consideration.
      The job title is: {job_title}
      The job description is: {job_description}
      
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.
    """
    
    system_message = SystemMessage(content="You are a strict Resume Auditor. You do not give vague advice. You provide exact rewrites and specific keyword gaps.")
    human_message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {
                "type": "image",
                "base64": image_data,
                "mime_type": "image/png"
            },
        ]
    )
    
    try:
        res = structured_llm.invoke([system_message, human_message])
        with open("response.json", "w") as f:
            json.dump(res.dict(), f)
        return res
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise e
        
    