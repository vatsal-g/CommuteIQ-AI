"""
CommuteIQ AI — Data Collection Script
Team: The Innovengers | Role: Ishaan Verma (ML & Data)

Collects real-time + historical data from:
  1. OpenWeatherMap  — weather conditions
  2. Open-Meteo     — historical weather (no key needed)
  3. TomTom         — real-time traffic + delays
  4. Google Maps    — traffic speed & congestion
  5. GTFS Feed      — Delhi Metro schedule
  6. Overpass API   — Bus stops / routes (OSM)

All data is saved to MongoDB Atlas.

HOW TO USE:
  1. pip install requests pymongo python-dotenv schedule gtfs-kit pandas
  2. Create a .env file with your API keys (see below)
  3. python commuteiq_data_collector.py

.env file format:
  OPENWEATHER_API_KEY=your_key_here
  TOMTOM_API_KEY=your_key_here
  GOOGLE_MAPS_API_KEY=your_key_here
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/commuteiq
"""

import os
import time
import requests
import schedule
import pandas as pd
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────
#  CONFIG — API KEYS & MONGO
# ─────────────────────────────────────────

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY")
TOMTOM_KEY      = os.getenv("TOMTOM_API_KEY")
GOOGLE_KEY      = os.getenv("GOOGLE_MAPS_API_KEY")
MONGO_URI       = os.getenv("MONGO_URI")

# Delhi NCR key coordinates (lat, lon)
DELHI_NCR_ZONES = {
    "Connaught Place":    (28.6315, 77.2167),
    "Dwarka":             (28.5921, 77.0460),
    "Noida Sector 18":    (28.5686, 77.3211),
    "Gurugram Cyber City":(28.4950, 77.0880),
    "Rohini":             (28.7041, 77.1025),
    "Lajpat Nagar":       (28.5694, 77.2430),
    "Nehru Place":        (28.5491, 77.2519),
    "Rajiv Chowk Metro":  (28.6328, 77.2197),
}


#  MONGODB SETUP

def get_db():
    client = MongoClient(MONGO_URI)
    return client["commuteiq"]

# ─────────────────────────────────────────
#  1. OPENWEATHERMAP — Real-time Weather
#  Free tier: 1,000 calls/day
#  Sign up: https://openweathermap.org/api
# ─────────────────────────────────────────

def collect_weather(lat, lon, zone_name):
    """Fetch current weather for a zone."""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_KEY,
        "units": "metric"
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()

        record = {
            "timestamp":         datetime.utcnow(),
            "zone":              zone_name,
            "lat":               lat,
            "lon":               lon,
            "weather_main":      data["weather"][0]["main"],       # Rain, Fog, Clear etc.
            "weather_desc":      data["weather"][0]["description"],
            "temp_celsius":      data["main"]["temp"],
            "humidity_pct":      data["main"]["humidity"],
            "visibility_meters": data.get("visibility", None),     # Low = fog risk
            "wind_speed_mps":    data["wind"]["speed"],
            "rain_1h_mm":        data.get("rain", {}).get("1h", 0),
            "is_fog":            data["weather"][0]["main"] in ["Fog", "Mist", "Haze"],
            "is_rain":           data["weather"][0]["main"] == "Rain",
        }
        return record

    except Exception as e:
        print(f"[Weather] Error for {zone_name}: {e}")
        return None


# ─────────────────────────────────────────
#  2. OPEN-METEO — Historical Weather
#  Fully free, no API key needed
#  Docs: https://open-meteo.com/
# ─────────────────────────────────────────

def collect_historical_weather(lat, lon, zone_name, days_back=30):
    """Fetch last N days of hourly weather — great for training data."""
    end_date   = datetime.utcnow().strftime("%Y-%m-%d")
    start_date = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%d")

    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude":        lat,
        "longitude":       lon,
        "start_date":      start_date,
        "end_date":        end_date,
        "hourly":          "temperature_2m,precipitation,visibility,windspeed_10m,weathercode",
        "timezone":        "Asia/Kolkata",
    }
    try:
        res = requests.get(url, params=params, timeout=15)
        res.raise_for_status()
        data = res.json()["hourly"]

        records = []
        for i, ts in enumerate(data["time"]):
            records.append({
                "timestamp":         ts,
                "zone":              zone_name,
                "lat":               lat,
                "lon":               lon,
                "temp_celsius":      data["temperature_2m"][i],
                "rain_mm":           data["precipitation"][i],
                "visibility_meters": data["visibility"][i],
                "wind_speed_kmh":    data["windspeed_10m"][i],
                "weather_code":      data["weathercode"][i],
                "source":            "open-meteo-historical"
            })
        print(f"[Open-Meteo] Got {len(records)} historical records for {zone_name}")
        return records

    except Exception as e:
        print(f"[Open-Meteo] Error for {zone_name}: {e}")
        return []


# ─────────────────────────────────────────
#  3. TOMTOM TRAFFIC API — Real-time Traffic
#  Free tier: 2,500 requests/day
#  Sign up: https://developer.tomtom.com/
# ─────────────────────────────────────────

def collect_tomtom_traffic(lat, lon, zone_name):
    """Fetch real-time traffic flow data for a point."""
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"
    params = {
        "key":   TOMTOM_KEY,
        "point": f"{lat},{lon}",
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json().get("flowSegmentData", {})

        record = {
            "timestamp":           datetime.utcnow(),
            "zone":                zone_name,
            "lat":                 lat,
            "lon":                 lon,
            "current_speed_kmph":  data.get("currentSpeed", None),
            "free_flow_speed":     data.get("freeFlowSpeed", None),
            "current_travel_time": data.get("currentTravelTime", None),  # seconds
            "free_flow_travel_time":data.get("freeFlowTravelTime", None),
            "confidence":          data.get("confidence", None),
            # Derived: delay ratio (>1 means delayed)
            "delay_ratio": (
                data["currentTravelTime"] / data["freeFlowTravelTime"]
                if data.get("freeFlowTravelTime") else None
            ),
            "congestion_score": round(
                max(0, (1 - data.get("currentSpeed", 0) /
                        max(data.get("freeFlowSpeed", 1), 1)) * 10), 2
            ),  # 0-10 score
        }
        return record

    except Exception as e:
        print(f"[TomTom] Error for {zone_name}: {e}")
        return None


# ─────────────────────────────────────────
#  4. GOOGLE MAPS — Distance Matrix (Travel Times)
#  Free: $200 credit/month (~40,000 calls)
#  Sign up: https://console.cloud.google.com/
# ─────────────────────────────────────────

def collect_google_travel_times(origin_name, dest_name):
    """Fetch current vs normal travel time between two zones."""
    origins = DELHI_NCR_ZONES.get(origin_name)
    dests   = DELHI_NCR_ZONES.get(dest_name)
    if not origins or not dests:
        return None

    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins":       f"{origins[0]},{origins[1]}",
        "destinations":  f"{dests[0]},{dests[1]}",
        "departure_time": "now",
        "traffic_model":  "best_guess",
        "key":            GOOGLE_KEY,
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        element = res.json()["rows"][0]["elements"][0]

        duration_normal  = element["duration"]["value"]           # seconds
        duration_traffic = element.get("duration_in_traffic", {}).get("value", duration_normal)

        record = {
            "timestamp":              datetime.utcnow(),
            "origin":                 origin_name,
            "destination":            dest_name,
            "distance_meters":        element["distance"]["value"],
            "duration_normal_sec":    duration_normal,
            "duration_traffic_sec":   duration_traffic,
            "delay_seconds":          duration_traffic - duration_normal,
            "delay_minutes":          round((duration_traffic - duration_normal) / 60, 2),
            "is_peak_hour":           datetime.now().hour in list(range(8,11)) + list(range(17,21)),
            "day_of_week":            datetime.now().strftime("%A"),
            "hour":                   datetime.now().hour,
        }
        return record

    except Exception as e:
        print(f"[Google Maps] Error {origin_name}→{dest_name}: {e}")
        return None


# ─────────────────────────────────────────
#  5. GTFS — Delhi Metro Schedule
#  Download feed from: https://otd.delhi.gov.in/
#  File: delhi_metro_gtfs.zip  (put in same folder)
# ─────────────────────────────────────────

def load_gtfs_metro_schedule(gtfs_zip_path="delhi_metro_gtfs.zip"):
    """
    Parse GTFS static feed for Delhi Metro.
    Returns a DataFrame of stop times (scheduled arrivals).
    Run once to load into MongoDB — doesn't need live internet.
    """
    try:
        import gtfs_kit as gk
        feed = gk.read_feed(gtfs_zip_path, dist_units="km")

        stop_times = feed.stop_times.merge(feed.trips, on="trip_id")
        stop_times = stop_times.merge(feed.stops, on="stop_id")
        stop_times = stop_times.merge(feed.routes, on="route_id")

        records = stop_times[[
            "trip_id", "route_short_name", "stop_name",
            "arrival_time", "departure_time", "stop_sequence"
        ]].to_dict("records")

        print(f"[GTFS Metro] Loaded {len(records)} stop-time records")
        return records

    except FileNotFoundError:
        print("[GTFS] delhi_metro_gtfs.zip not found.")
        print("  → Download from: https://otd.delhi.gov.in/data/dynamic/")
        return []
    except Exception as e:
        print(f"[GTFS] Error: {e}")
        return []


# ─────────────────────────────────────────
#  6. OVERPASS API — Bus Stops & Routes (OSM)
#  Completely free, no key needed
#  Docs: https://overpass-api.de/
# ─────────────────────────────────────────

def collect_delhi_bus_stops():
    """Fetch all DTC bus stops in Delhi from OpenStreetMap."""
    url = "https://overpass-api.de/api/interpreter"
    query = """
    [out:json][timeout:30];
    area["name"="Delhi"]["admin_level"="4"]->.searchArea;
    node["highway"="bus_stop"](area.searchArea);
    out body;
    """
    try:
        res = requests.post(url, data={"data": query}, timeout=40)
        res.raise_for_status()
        elements = res.json().get("elements", [])

        records = []
        for el in elements:
            records.append({
                "stop_id":   el.get("id"),
                "lat":       el.get("lat"),
                "lon":       el.get("lon"),
                "stop_name": el.get("tags", {}).get("name", "Unknown"),
                "operator":  el.get("tags", {}).get("operator", "DTC"),
                "source":    "openstreetmap"
            })

        print(f"[Overpass/OSM] Found {len(records)} bus stops in Delhi")
        return records

    except Exception as e:
        print(f"[Overpass] Error: {e}")
        return []


# ─────────────────────────────────────────
#  SAVE TO MONGODB
# ─────────────────────────────────────────

def save_to_mongo(collection_name, records):
    """Insert one or many records into MongoDB."""
    try:
        db = get_db()
        col = db[collection_name]
        if isinstance(records, list):
            if records:
                col.insert_many(records)
                print(f"[MongoDB] Saved {len(records)} records → {collection_name}")
        elif records:
            col.insert_one(records)
            print(f"[MongoDB] Saved 1 record → {collection_name}")
    except Exception as e:
        print(f"[MongoDB] Error saving to {collection_name}: {e}")


# ─────────────────────────────────────────
#  COMBINED SNAPSHOT — runs every 15 min
# ─────────────────────────────────────────

def collect_realtime_snapshot():
    """Collect weather + traffic for all Delhi NCR zones."""
    print(f"\n{'='*50}")
    print(f"[Snapshot] Starting at {datetime.now().strftime('%H:%M:%S')}")

    for zone, (lat, lon) in DELHI_NCR_ZONES.items():

        # Weather
        weather = collect_weather(lat, lon, zone)
        if weather:
            save_to_mongo("weather_realtime", weather)

        # TomTom Traffic
        traffic = collect_tomtom_traffic(lat, lon, zone)
        if traffic:
            save_to_mongo("traffic_realtime", traffic)

        time.sleep(1)  # be kind to APIs

    # Google Travel Times — sample key routes
    key_routes = [
        ("Dwarka",             "Connaught Place"),
        ("Noida Sector 18",    "Connaught Place"),
        ("Gurugram Cyber City","Connaught Place"),
        ("Rohini",             "Connaught Place"),
    ]
    for origin, dest in key_routes:
        travel = collect_google_travel_times(origin, dest)
        if travel:
            save_to_mongo("travel_times", travel)
        time.sleep(1)

    print(f"[Snapshot] Done ✓")


# ─────────────────────────────────────────
#  ONE-TIME HISTORICAL BACKFILL
# ─────────────────────────────────────────

def backfill_historical_weather(days_back=30):
    """Run once to populate last 30 days of weather for all zones."""
    print(f"\n[Backfill] Fetching {days_back} days of historical weather...")
    for zone, (lat, lon) in DELHI_NCR_ZONES.items():
        records = collect_historical_weather(lat, lon, zone, days_back)
        save_to_mongo("weather_historical", records)
        time.sleep(2)
    print("[Backfill] Historical weather done ✓")


def backfill_bus_stops():
    """Run once to load all Delhi bus stops into MongoDB."""
    stops = collect_delhi_bus_stops()
    save_to_mongo("bus_stops", stops)


def backfill_metro_schedule():
    """Run once after downloading GTFS zip."""
    records = load_gtfs_metro_schedule()
    save_to_mongo("metro_schedule", records)


# ─────────────────────────────────────────
#  SCHEDULER — auto-collect every 15 min
# ─────────────────────────────────────────

def start_scheduler():
    print("CommuteIQ Data Collector Starting...")
    print("Collecting every 15 minutes. Press Ctrl+C to stop.\n")

    # Run once immediately
    collect_realtime_snapshot()

    # Then every 15 minutes
    schedule.every(15).minutes.do(collect_realtime_snapshot)

    while True:
        schedule.run_pending()
        time.sleep(30)


# ─────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        cmd = sys.argv[1]

        if cmd == "backfill":
            # Run this FIRST to get historical training data
            backfill_historical_weather(days_back=30)
            backfill_bus_stops()
            backfill_metro_schedule()

        elif cmd == "snapshot":
            # Run a single collection snapshot
            collect_realtime_snapshot()

        elif cmd == "schedule":
            # Run continuous real-time collection
            start_scheduler()

    else:
        print("""
CommuteIQ AI Data Collector
Usage:
  python commuteiq_data_collector.py backfill   → Get 30 days historical data (run first!)
  python commuteiq_data_collector.py snapshot   → Single collection run
  python commuteiq_data_collector.py schedule   → Start continuous collection (every 15 min)
        """)
