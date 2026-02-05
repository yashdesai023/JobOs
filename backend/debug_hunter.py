import os
import requests
from dotenv import load_dotenv

# Load from current directory or parent
load_dotenv()

def check_env():
    print("--- Debugging Job Hunter Environment ---")
    jina = os.getenv("JINA_API_KEY")
    groq = os.getenv("GROQ_API_KEY")
    pb_url = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")
    
    print(f"JINA_API_KEY: {'[SET]' if jina else '[MISSING]'}")
    print(f"GROQ_API_KEY: {'[SET]' if groq else '[MISSING]'}")
    print(f"POCKETBASE_URL: {pb_url}")

    # Check PocketBase Connection
    try:
        print(f"\nTesting PocketBase Connection to {pb_url}/api/health...")
        resp = requests.get(f"{pb_url}/api/health", timeout=5)
        if resp.status_code == 200:
            print(f"[OK] PocketBase Health: Online ({resp.json()})")
        else:
            print(f"[WARN] PocketBase Health: {resp.status_code} (It might be running directly without health endpoint)")
            
        # Try checking collections to be sure
        try:
            resp = requests.get(f"{pb_url}/api/collections/job_reports/records", params={'perPage': 1}, timeout=5)
            if resp.status_code == 200:
                 print("[OK] Access to 'job_reports' collection: Success")
            else:
                 print(f"[WARN] Access to 'job_reports' collection failed: {resp.status_code} - {resp.text}")
        except:
             pass

    except Exception as e:
        print(f"[FAIL] PocketBase Connection Failed: {e}")
        print("   Make sure PocketBase is running at the specified URL.")

    # Check Jina (if key exists)
    if jina:
        try:
             print("\nTesting Jina Scraper...")
             headers = {"Authorization": f"Bearer {jina}"}
             resp = requests.get("https://r.jina.ai/https://example.com", headers=headers, timeout=10)
             if resp.status_code == 200:
                 print("[OK] Jina Scraper: Success")
             else:
                 print(f"[FAIL] Jina Scraper Failed: {resp.status_code} - {resp.text[:100]}")
        except Exception as e:
            print(f"[FAIL] Jina Connection Failed: {e}")

if __name__ == "__main__":
    check_env()
