from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# =========================
# LOAD ENVIRONMENT
# =========================

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise Exception("MONGO_URI not found in .env")

client = MongoClient(mongo_uri)

db = client["commuteiq"]

traffic_collection = db["traffic_realtime"]
weather_collection = db["weather_realtime"]

# =========================
# GET LATEST RECORDS
# =========================

latest_traffic = traffic_collection.find_one(sort=[("_id", -1)])
latest_weather = weather_collection.find_one(sort=[("_id", -1)])

if not latest_traffic:
    raise Exception("No traffic data found")

if not latest_weather:
    raise Exception("No weather data found")

# =========================
# TRAFFIC EFFICIENCY
# =========================

current_speed = latest_traffic["current_speed_kmph"]
free_flow_speed = latest_traffic["free_flow_speed"]

speed_efficiency = (current_speed / free_flow_speed) * 100

# =========================
# DELAY EFFICIENCY
# =========================

current_time = latest_traffic["current_travel_time"]
free_flow_time = latest_traffic["free_flow_travel_time"]

delay_efficiency = (free_flow_time / current_time) * 100

# =========================
# WEATHER SCORE
# =========================

weather_score = 100

if latest_weather.get("is_rain", False):
    weather_score -= 25

if latest_weather.get("is_fog", False):
    weather_score -= 20

if latest_weather.get("visibility_meters", 10000) < 3000:
    weather_score -= 15

if latest_weather.get("temp_celsius", 25) > 42:
    weather_score -= 10

weather_score = max(weather_score, 0)

# =========================
# CROWD SCORE
# =========================

hour = datetime.now().hour

if 8 <= hour <= 10:
    time_factor = 40

elif 17 <= hour <= 20:
    time_factor = 40

elif 11 <= hour <= 16:
    time_factor = 70

else:
    time_factor = 90

crowd_efficiency = (
    time_factor * 0.60 +
    speed_efficiency * 0.40
)

# =========================
# COMMUTE TWIN ENGINE
# =========================

reliability = int(

    speed_efficiency * 0.35 +

    delay_efficiency * 0.35 +

    weather_score * 0.15 +

    crowd_efficiency * 0.15
)

reliability = max(0, min(reliability, 100))

# =========================
# DELAY PREDICTION
# =========================

delay_prediction = int((100 - reliability) / 3)

# =========================
# ROUTE DECISION
# =========================

if reliability < 60:

    route_status = "High Risk"

    recommendation = "Switch To Metro + Walking"

elif reliability < 80:

    route_status = "Moderate Risk"

    recommendation = "Monitor Route"

else:

    route_status = "Reliable"

    recommendation = "Current Route Optimal"

# =========================
# SAVE RESULT
# =========================

db["reliability_scores"].insert_one({

    "timestamp": datetime.utcnow(),

    "reliability": reliability,

    "delay_prediction": delay_prediction,

    "speed_efficiency": round(speed_efficiency, 2),

    "delay_efficiency": round(delay_efficiency, 2),

    "weather_score": weather_score,

    "crowd_efficiency": round(crowd_efficiency, 2),

    "route_status": route_status,

    "recommendation": recommendation

})

# =========================
# OUTPUT
# =========================

print("\n========== COMMUTE TWIN ENGINE ==========")

print("Zone              :", latest_traffic["zone"])

print("Speed Efficiency  :", round(speed_efficiency, 2))

print("Delay Efficiency  :", round(delay_efficiency, 2))

print("Weather Score     :", weather_score)

print("Crowd Score       :", round(crowd_efficiency, 2))

print("-----------------------------------------")

print("Reliability       :", reliability, "%")

print("Predicted Delay   :", delay_prediction, "minutes")

print("Route Status      :", route_status)

print("Recommendation    :", recommendation)

print("=========================================")