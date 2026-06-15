from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)
db = client["commuteiq"]
result = db.test.insert_one({
    "message": "CommuteIQ Connected"})
print("Inserted:", result.inserted_id)