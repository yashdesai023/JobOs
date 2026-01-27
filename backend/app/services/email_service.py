import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("BREVO_API_KEY")
        self.api_url = "https://api.brevo.com/v3/smtp/email"
        self.sender_email = os.getenv("EMAIL_SENDER", "notification@jobos.online")
        self.sender_name = "JobOs AI"
        
        if not self.api_key:
            print("⚠️ EmailService Warning: BREVO_API_KEY not found in environment variables.")

    def send_notification(self, receiver_email: str, subject: str, html_content: str, attachment: dict = None):
        """
        Sends an HTML email using Brevo API.
        attachment: {"name": "report.pdf", "url": "..."}
        """
        if not self.api_key:
            print("❌ Cannot send email: Missing API Key.")
            return False

        headers = {
            "accept": "application/json",
            "api-key": self.api_key,
            "content-type": "application/json"
        }

        payload = {
            "sender": {"name": self.sender_name, "email": self.sender_email},
            "to": [{"email": receiver_email}],
            "subject": subject,
            "htmlContent": html_content
        }

        # Handle Attachments (Brevo accepts URL or Base64)
        # Ideally we pass a URL. If it's a file path, we might need to handle it differently.
        # For this implementation, we'll rely on the HTML content containing the download link 
        # as it's more reliable for "Marketing" style than large attachments.
        # But if a specific attachment dict is passed with a public URL:
        if attachment and attachment.get('url'):
            payload["attachment"] = [
                {"url": attachment['url'], "name": attachment.get('name', 'document.pdf')}
            ]

        try:
            response = requests.post(self.api_url, headers=headers, data=json.dumps(payload))
            
            if response.status_code == 201:
                print(f"✅ Email sent successfully to {receiver_email}")
                return True
            else:
                print(f"❌ Failed to send email: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Email Service Error: {str(e)}")
            return False
