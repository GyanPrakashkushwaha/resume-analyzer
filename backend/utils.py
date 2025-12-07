from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from models import Feedback
from dotenv import load_dotenv

if not load_dotenv():
    raise Exception("Incorrect/unavailable **API KEY**")

def analyze_resume(job_title, job_description, image_data):
    # model initialization 
    llm = ChatGoogleGenerativeAI(
        model = "models/gemini-2.5-flash",
        temperature = 0
    )
    
    # Structured output
    structured_llm = llm.with_structured_output(Feedback)
    
    # Prompt
    prompt_text = f"""
    Please analyze and rate the resume provided in the image and suggest how to improve it.
    
    The job title is: {job_title}
    The job description is: {job_description}
    
    The rating can be low if the resume is bad.
    Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
    If there is a lot to improve, don't hesitate to give low scores.
    """
    
    system_message = SystemMessage(content="You are an expert in ATS (Applicant Tracking System) and resume analysis.")
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
        return res
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise e
        
    