from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["commuteiq"]

reliability_collection = db["reliability_scores"]
latest = reliability_collection.find_one(
    sort=[("_id", -1)]
)

print(latest)
reliability = latest["reliability"]
delay = latest["delay_prediction"]
if reliability < 60:

    recommended_mode = "Metro + Walking"
    confidence = 95
    reason = "Heavy traffic conditions detected"

elif reliability < 80:

    recommended_mode = "Carpool"
    confidence = 85
    reason = "Moderate traffic risk"

else:

    recommended_mode = "Current Route"
    confidence = 90
    reason = "Traffic conditions stable"
    time_saved = max(
    0,
    delay - 2
)
    recommendation_collection =db["commute_recommendations"]
    recommendation_collection.insert_one({

    "timestamp": datetime.utcnow(),

    "recommended_mode": recommended_mode,

    "confidence": confidence,

    "reason": reason,

    "estimated_time_saved": time_saved
})
print("\n===== COMMUTE RECOMMENDATION =====")

print("Mode :", recommended_mode)

print("Confidence :", confidence)

print("Reason :", reason)

print("Time Saved :", time_saved, "minutes")