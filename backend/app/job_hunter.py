from phi.agent import Agent
from phi.model.groq import Groq
import os
import requests
import json
from dotenv import load_dotenv
from .reporting import generate_job_report

load_dotenv()

def get_job_parser_agent():
    return Agent(
        model=Groq(id="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY")),
        description="You are an expert Job Hunter. Your goal is to extract structured job data.",
        instructions=[
            "You will be given Markdown content of a job search page.",
            "Extract valid job listings.",
            "For each job, extract: 'title', 'company', 'location', 'link', 'summary' (20 words max), and 'source' (e.g. LinkedIn, YC).",
            "CRITICAL: Output ONLY a valid JSON list of objects. Do not write markdown blocks or text.",
            "Example: [{'title': '...', 'company': '...', ...}]",
            "If no jobs found, output an empty list: []"
        ],
        show_tool_calls=False,
        markdown=False # We want raw text (JSON)
    )

def scrape_with_jina(target_url: str) -> str:
    """
    Uses Jina.ai Reader API to turn a URL into LLM-friendly Markdown.
    """
    try:
        api_url = f"https://r.jina.ai/{target_url}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        jina_key = os.getenv("JINA_API_KEY")
        if jina_key:
            headers["Authorization"] = f"Bearer {jina_key}"

        print(f"   [Scraper] Fetching: {target_url} via Jina...")
        response = requests.get(api_url, headers=headers, timeout=25)
        
        if response.status_code == 200:
            return response.text[:20000] # Increased limit for more jobs
        elif response.status_code == 401:
            return "Error: 401 Unauthorized"
        else:
            return f"Error: Scraper returned status {response.status_code}"
    except Exception as e:
        return f"Error connecting to scraper: {str(e)}"

def run_job_hunt(preferences: dict = None):
    """
    Executes the job hunt based on preferences.
    preferences = { 'role': '...', 'experience': '...', 'location': '...', 'skills': [...] }
    """
    print("🏹 JobOs Hunter: Starting Enhanced Hunt...")
    if not preferences:
        preferences = {"role": "Generative AI", "location": "Remote", "experience": "Any"}

    agent = get_job_parser_agent()
    role_encoded = preferences.get('role', 'Software Engineer').replace(' ', '%20')
    loc_encoded = preferences.get('location', '').replace(' ', '%20')
    
    # EXPANDED TARGET LIST (10+ Sources logic)
    # We construct URLs dynamically based on the role where possible
    targets = [
        # 1. YCombinator
        f"https://www.ycombinator.com/jobs?role=Software%20Engineer&q={role_encoded}",
        # 2. RemoteOK
        f"https://remoteok.com/remote-{role_encoded.lower()}-jobs",
        # 3. LinkedIn (Guest)
        f"https://www.linkedin.com/jobs/search?keywords={role_encoded}&location={loc_encoded or 'Worldwide'}&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0",
        # 4. Wellfound (Search URL)
        f"https://wellfound.com/jobs?q={role_encoded}",
        # 5. WeWorkRemotely
        f"https://weworkremotely.com/remote-jobs/search?term={role_encoded}",
        # 6. FlexJobs (Search)
        f"https://www.flexjobs.com/search?search={role_encoded}",
        # 7. Himalayan (Python specific often, but general search exists)
        "https://himalayas.app/jobs/python", 
        # 8. WorkingNomads
        f"https://www.workingnomads.com/jobs?tag={role_encoded}",
        # 9. Arc.dev
        f"https://arc.dev/remote-jobs?q={role_encoded}",
        # 10. Naukri (India focus)
        f"https://www.naukri.com/{role_encoded.lower()}-jobs"
    ]
    
    all_jobs = []
    
    for url in targets[:8]: # Limit to 8 targets per run to save time/tokens for now, or loop all
        print(f" -> Processing Target: {url}")
        content = scrape_with_jina(url)
        
        if "Error" in content:
             print(f"    Skipping: {content}")
             continue

        try:
             # Extract structured data
             prompt = f"""
             Extract job listings from this content matching role='{preferences.get('role')}' and location='{preferences.get('location')}'.
             Content:
             {content[:15000]}
             """
             response = agent.run(prompt)
             
             # Parse JSON safety
             raw_json = response.content.replace("```json", "").replace("```", "").strip()
             if raw_json.startswith("["):
                 batch_jobs = json.loads(raw_json)
                 print(f"    Found {len(batch_jobs)} jobs.")
                 all_jobs.extend(batch_jobs)
             else:
                 print("    Agent did not return valid JSON.")
                 
        except Exception as e:
             print(f"    Error parsing {url}: {e}")

    # Deduplicate by link
    unique_jobs = {job['link']: job for job in all_jobs if 'link' in job}.values()
    final_list = list(unique_jobs)
    
    print(f"✅ Hunt Complete. Total Unique Jobs: {len(final_list)}")
    
    # Generate Report
    if final_list:
        report_meta = generate_job_report(final_list, preferences)
        return {
            "status": "success", 
            "results": final_list, 
            "report": report_meta
        }
    else:
        return {"status": "no_jobs_found", "results": []}
