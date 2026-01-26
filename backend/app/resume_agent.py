from phi.agent import Agent
from phi.model.groq import Groq
from pocketbase import PocketBase
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize PB
pb = PocketBase("http://127.0.0.1:8090")

def fetch_user_portfolio():
    """
    Fetches all relevant user data from PocketBase to build the 'Context'.
    """
    context = {"projects": [], "certifications": [], "skills": []}
    
    try:
        # 1. Projects
        try:
            projects = pb.collection('projects').get_list(1, 20, {"sort": "-created"})
            for p in projects.items:
                context["projects"].append({
                    "name": getattr(p, "project_name", "Untitled"),
                    "tech_stack": getattr(p, "tech_stack", ""),
                    "description": getattr(p, "description", ""),
                    "category": getattr(p, "category", "")
                })
        except Exception as e:
             print(f"Warning: Could not fetch projects (Collection might be missing): {e}")

        # 2. Certifications
        try:
            certs = pb.collection('certifications').get_list(1, 20)
            for c in certs.items:
                context["certifications"].append({
                    "name": getattr(c, "certificate_name", "Untitled"),
                    "provider": getattr(c, "provider", ""),
                    "date": getattr(c, "completion_date", "")
                })
        except Exception as e:
             print(f"Warning: Could not fetch certifications: {e}")
            
        # 3. Resume Skills (Ideally from a structured collection, or we infer from projects)
        # For now, we aggregate unique tech stacks
        all_tech = set()
        for p in context["projects"]:
            if p["tech_stack"]:
                skills = [s.strip() for s in p["tech_stack"].split(',')]
                all_tech.update(skills)
        context["skills"] = list(all_tech)
        
    except Exception as e:
        print(f"Error fetching portfolio from PB: {e}")
        
    return context

def get_resume_agent():
    return Agent(
        model=Groq(id="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY")),
        description="You are an expert ATS Resume Writer & Career Coach.",
        instructions=[
            "You will be given a Candidate's Portfolio (Projects, Skills, Certs) and a Target Job Description.",
            "Your task is to write the content for a high-impact, ATS-optimized resume.",
            "Rules:",
            "1. PROFESSIONAL SUMMARY: Write a 3-sentence summary tailored exactly to the JD keywords.",
            "2. SKILLS: Select the top 10 skills from the portfolio that match the JD.",
            "3. PROJECTS: Select the 3 most relevant projects. Rewrite their descriptions to emphasize impacts & results relevant to the JD.",
            "4. EXPERIENCE: If usually empty for freshers, focus heavily on Projects.",
            "5. OUTPUT FORMAT: Return valid JSON with keys: 'summary', 'skills' (list), 'projects' (list of objects with name, tech, bullet_points), 'certifications'.",
        ],
        show_tool_calls=False,
        markdown=False # We want JSON
    )

def generate_tailored_resume(job_description: str):
    """
    Orchestrates the resume generation process.
    """
    print("📝 Resume Agent: Fetching Portfolio...")
    portfolio = fetch_user_portfolio()
    
    print("🧠 Resume Agent: Analyzing JD & Generating Content...")
    agent = get_resume_agent()
    
    prompt = f"""
    CANDIDATE PORTFOLIO:
    {portfolio}
    
    TARGET JOB DESCRIPTION:
    {job_description}
    
    Action: Generate the resume content now in JSON format.
    """
    
    try:
        response = agent.run(prompt)
        return response.content
    except Exception as e:
        return f"Error generating resume: {e}"
