import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from pocketbase import PocketBase

# Initialize PocketBase (Use Env Var for Cloud, fallback to Localhost)
PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")
pb = PocketBase(PB_URL)

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'generated_reports')

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def generate_job_report(jobs: list, metadata: dict):
    """
    Generates HTML and PDF reports for a list of jobs.
    Uploads them to PocketBase.
    
    Args:
        jobs (list): List of dicts {title, company, location, link, summary, source}
        metadata (dict): {role, experience, ...}
    
    Returns:
        dict: {pdf_path, html_path, pb_record_id}
    """
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template('report_template.html')
    
    # 1. Render HTML
    date_str = datetime.now().strftime("%Y-%m-%d")
    context = {
        'date': date_str,
        'role': metadata.get('role', 'General'),
        'experience': metadata.get('experience', 'Any'),
        'total_jobs': len(jobs),
        'jobs': jobs
    }
    html_content = template.render(context)
    
    # Files
    filename_base = f"JobOs_Report_{date_str}_{datetime.now().strftime('%H%M%S')}"
    html_path = os.path.join(OUTPUT_DIR, f"{filename_base}.html")
    pdf_path = os.path.join(OUTPUT_DIR, f"{filename_base}.pdf")
    
    # Save HTML
    with open(html_path, "w", encoding='utf-8') as f:
        f.write(html_content)
        
    # 2. Generate PDF
    with open(pdf_path, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_file)
        
    if pisa_status.err:
        print(f"Error generating PDF: {pisa_status.err}")
        return None

    # 3. Store in PocketBase (Using requests for reliable file upload)
    record_id = None
    try:
        import requests
        
        # Prepare multipart form data
        # We need to open the files ensuring they stay open during the request
        fname_pdf = os.path.basename(pdf_path)
        fname_html = os.path.basename(html_path)
        
        with open(pdf_path, 'rb') as f_pdf, open(html_path, 'rb') as f_html:
            files = [
                ('report_pdf', (fname_pdf, f_pdf, 'application/pdf')),
                ('report_html', (fname_html, f_html, 'text/html'))
            ]
            
            data = {
                "date": datetime.now().isoformat(),
                "role": metadata.get('role', ''),
                "status": "Completed",
                "jobs_found": len(jobs)
            }
            
            # Use direct API endpoint
            api_url = f"{PB_URL}/api/collections/job_reports/records"
            response = requests.post(api_url, data=data, files=files)
            
            if response.status_code >= 200 and response.status_code < 300:
                record = response.json()
                record_id = record.get('id')
                print(f"✅ Report saved to PocketBase: {record_id}")
            else:
                print(f"⚠️ Failed to upload to PocketBase: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"⚠️ Failed to upload to PocketBase (Ensure 'job_reports' collection exists): {e}")

    return {
        "pdf_path": pdf_path,
        "html_path": html_path,
        "pb_record_id": record_id
    }

def generate_resume_pdf(resume_data: dict, job_title: str, style: str = "harvard"):
    """
    Generates a PDF resume based on the AI output.
    """
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    
    # Select Template
    template_name = 'resume_template_creative.html' if style == 'creative' else 'resume_template.html'
    template = env.get_template(template_name)
    
    # 1. Render HTML
    context = resume_data # Expected keys: summary, skills, projects, certifications
    html_content = template.render(context)
    
    # Files
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename_base = f"Resume_{style}_{job_title.replace(' ', '_')}_{datetime.now().strftime('%H%M')}"
    pdf_path = os.path.join(OUTPUT_DIR, f"{filename_base}.pdf")
    html_path = os.path.join(OUTPUT_DIR, f"{filename_base}.html")
    
    with open(html_path, "w", encoding='utf-8') as f:
        f.write(html_content)
        
    with open(pdf_path, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_file)

    # 2. Upload to PB (Targeting 'resume_generated' collection)
    import requests
    record_id = None
    try:
        with open(pdf_path, 'rb') as f_pdf:
            # Field name in PB is 'resume_pdf'
            files = [('resume_pdf', (os.path.basename(pdf_path), f_pdf, 'application/pdf'))]
            data = {
                "date": datetime.now().isoformat(),
                "role": f"{job_title} ({style})",
                "status": "Generated"
            }
            api_url = f"{PB_URL}/api/collections/resume_generated/records"
            response = requests.post(api_url, data=data, files=files)
            if response.status_code < 300:
                record_id = response.json().get('id')
            else:
                 print(f"Failed to upload resume: {response.text}")
    except Exception as e:
        print(f"Error uploading resume: {e}")

    return {
        "pdf_path": pdf_path,
        "pb_record_id": record_id,
        "collection_id": "resume_generated" # return collection name for frontend link construction
    }
