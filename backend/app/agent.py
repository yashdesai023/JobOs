from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv
import os
import requests
import json
import io
from pypdf import PdfReader

load_dotenv()

PB_URL = "http://127.0.0.1:8090"

def get_collection_data(collection: str, filter_str: str = "") -> str:
    """
    Fetches data from a PocketBase collection.
    Args:
        collection (str): The name of the collection (e.g., 'projects', 'resumes', 'contacts').
        filter_str (str): Optional filter string (e.g., 'category="Gen AI"').
    Returns:
        str: JSON string of the results.
    """
    try:
        url = f"{PB_URL}/api/collections/{collection}/records"
        params = {"perPage": 50}
        if filter_str:
            params["filter"] = filter_str
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return json.dumps(data.get("items", []), indent=2)
    except Exception as e:
        return f"Error fetching data: {str(e)}"

def read_file_content(collection: str, record_id: str, filename: str) -> str:
    """
    Reads the text content of a PDF file from PocketBase.
    Args:
        collection (str): The collection name (e.g., 'resumes', 'certifications').
        record_id (str): The record ID.
        filename (str): The filename stored in the record.
    Returns:
        str: Extracted text from the file.
    """
    try:
        url = f"{PB_URL}/api/files/{collection}/{record_id}/{filename}"
        response = requests.get(url)
        response.raise_for_status()
        
        # Process PDF
        if filename.lower().endswith('.pdf'):
            with io.BytesIO(response.content) as f:
                reader = PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text[:5000] # Limit text to avoid token limits
        
        return "Error: Unsupported file format (only PDF supported currently)."
    except Exception as e:
        return f"Error reading file: {str(e)}"

from phi.storage.agent.sqlite import SqlAgentStorage

# ... (existing imports and functions)

def get_job_os_agent():
    # Define storage for persistent memory
    storage = SqlAgentStorage(table_name="agent_sessions", db_file="brain.db")
    
    return Agent(
        model=Groq(id="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY")),
        instructions=[
            "You are the JobOs Intelligent Assistant. Answer based on PocketBase data.",
            "Collections: 'projects', 'resumes', 'cvs', 'placement_agencies', 'recruiters', 'certifications'.",
            "Rules:",
            "- Use plural collection names (e.g., 'certifications').",
            "- To read a file: 1. Find it with `get_collection_data`. 2. Read it with `read_file_content`.",
            "- Return tables for lists.",
            "- Be concise.",
        ],
        tools=[get_collection_data, read_file_content],
        show_tool_calls=False,
        add_history_to_messages=True,
        markdown=True,
        storage=storage,  # Enable persistent storage
        read_chat_history=True # Auto-read history from storage based on session_id
    )
