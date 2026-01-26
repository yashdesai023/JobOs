from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from .job_hunter import run_job_hunt
import asyncio

scheduler = AsyncIOScheduler()

def start_scheduler():
    """
    Starts the background scheduler.
    """
    # Daily Trigger at 8:00 AM
    trigger = CronTrigger(hour=8, minute=0)
    
    # Add the job
    scheduler.add_job(
        run_job_hunt,
        trigger=trigger,
        id="daily_job_hunt",
        replace_existing=True
    )
    
    # For Testing: Run it once 10 seconds after startup so the user sees it working
    # scheduler.add_job(run_job_hunt, 'date', run_date=datetime.now() + timedelta(seconds=10))
    
    scheduler.start()
    print("⏰ JobOs Scheduler: Active (Daily at 8:00 AM)")
