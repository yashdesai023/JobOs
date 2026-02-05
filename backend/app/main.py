from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .agent import get_job_os_agent
from phi.agent import Agent

from .scheduler import start_scheduler

app = FastAPI(title="JobOs AI Brain")

from fastapi.staticfiles import StaticFiles
import os

# Mount reports directory for downloading
REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'generated_reports')
if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)
    
app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")

@app.on_event("startup")
async def startup_event():
    start_scheduler()

# CORS - Allow Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://yash.jobos.online"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class HuntRequest(BaseModel):
    role: str = "Generative AI"
    experience: str = "Any"
    location: str = "Remote"
    skills: list[str] = []

from fastapi.responses import StreamingResponse

# Initialize Agent
agent_instance: Agent = get_job_os_agent()

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        def stream_generator():
            # Run the agent in streaming mode with session_id
            response_stream = agent_instance.run(request.message, stream=True, session_id=request.session_id)
            for chunk in response_stream:
                if chunk and isinstance(chunk.content, str):
                    yield chunk.content

        return StreamingResponse(stream_generator(), media_type="text/plain")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "active", "brain": "online"}

from .job_hunter import run_job_hunt

@app.post("/api/trigger-hunt")
async def trigger_hunt(request: HuntRequest):
    try:
        # Run the job hunt logic with preferences
        preferences = {
            "role": request.role,
            "experience": request.experience,
            "location": request.location,
            "skills": request.skills
        }
        results = run_job_hunt(preferences)
        return {"status": "success", "data": results}
    except Exception as e:
        print(f"Error during manual hunt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ResumeRequest(BaseModel):
    job_description: str
    job_title: str
    style: str = "harvard"

from .resume_agent import generate_tailored_resume
from .reporting import generate_resume_pdf
import json

@app.post("/api/generate-resume")
async def generate_resume(request: ResumeRequest):
    try:
        print(f"Received resume request for: {request.job_title} (Style: {request.style})")
        
        # 1. Generate Content (AI)
        raw_content = generate_tailored_resume(request.job_description)
        print(f"AI Response Preview: {raw_content[:200]}...") # Debug log
        
        # Parse JSON from AI response
        # Clean potential markdown fences
        clean_json = raw_content.replace("```json", "").replace("```", "").strip()
        
        # Attempt to find the first '{' and last '}' to handle potential preamble text
        start_idx = clean_json.find('{')
        end_idx = clean_json.rfind('}')
        if start_idx != -1 and end_idx != -1:
            clean_json = clean_json[start_idx:end_idx+1]
            
        try:
            resume_data = json.loads(clean_json)
        except json.JSONDecodeError as je:
             print(f"JSON Decode Error! Raw content was: {clean_json}")
             raise ValueError("AI did not return valid JSON. Please try again.")

        # 2. Generate PDF with Style
        result = generate_resume_pdf(resume_data, request.job_title, style=request.style)
        
        return {"status": "success", "data": result, "preview": resume_data}
        
    except Exception as e:
        print(f"Error generating resume: {e}")
        # Print full stack trace for debugging
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
