import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TravelInsights() {
  const stations = [
  {
    name: "Rajiv Chowk",
    crowd: "High",
    delay: "5 min",
    status: "Operational"
  },
  {
    name: "Vaishali",
    crowd: "Medium",
    delay: "2 min",
    status: "Operational"
  },
  {
    name: "Botanical Garden",
    crowd: "Low",
    delay: "0 min",
    status: "Operational"
  },
  {
    name: "Noida City Centre",
    crowd: "Medium",
    delay: "1 min",
    status: "Operational"
  },
  {
    name: "HUDA City Centre",
    crowd: "High",
    delay: "4 min",
    status: "Operational"
  }
];
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recommendationData, setRecommendationData] = useState<any>(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "https://commuteiq-ai-backend.onrender.com/api/reliability/dashboard"
        );

        const data = await response.json();

        console.log("Dashboard Data:", data);

        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    };
    const fetchRecommendation = async () => {

  try {

    const response = await fetch(
      "https://commuteiq-ai-backend.onrender.com/api/recommendation"
    );

    const data = await response.json();

    console.log("Recommendation:", data);

    setRecommendationData(data);

  } catch (error) {

    console.error(error);

  }

};

    fetchDashboard();
fetchRecommendation();
   const interval = setInterval(() => {

  fetchDashboard();

  fetchRecommendation();

}, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="page-enter page-content"
      style={{
        minHeight: "calc(100vh - 76px)",
        padding: "clamp(34px,5vw,58px) clamp(18px,5vw,64px) 118px",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
    >
      <div
        className="flex items-start gap-4 mb-7"
        style={{ maxWidth: 980 }}
      >
        <span
          className="inline-flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-md text-[13px] font-bold"
          style={{
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,.04)",
            color: "var(--text-soft)",
          }}
        >
          05
        </span>

        <div>
          <h2
            style={{
              fontSize: "clamp(34px,5vw,68px)",
              lineHeight: 1,
              fontWeight: 810,
            }}
          >
            Travel Insights
          </h2>

          <p
            className="mt-3"
            style={{
              maxWidth: 650,
              color: "var(--text-soft)",
              fontSize: 17,
              lineHeight: 1.55,
            }}
          >
            Predictive signals behind the recommendation,
            shown before the trip starts.
          </p>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(5,minmax(0,1fr))",
        }}
      >
        {/* TRAFFIC */}
        <article
          className="grid gap-3 p-[18px] rounded-lg"
          style={{
            minHeight: 280,
            border: "1px solid var(--line)",
            background: "rgba(15,23,42,.62)",
            alignContent: "start",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
              fontSize: 11,
              fontWeight: 780,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Traffic Forecast
          </span>

          <strong
            style={{
              fontSize: 27,
              lineHeight: 1.12,
            }}
          >
            {dashboardData?.traffic?.zone ?? "Loading..."}
          </strong>

          <div
            style={{
              color: "var(--text-soft)",
              fontSize: 15,
              lineHeight: 1.8,
            }}
          >
            <div>
              Current Speed:{" "}
              {dashboardData?.traffic?.current_speed_kmph ?? "--"} km/h
            </div>

            <div>
              Free Flow Speed:{" "}
              {dashboardData?.traffic?.free_flow_speed ?? "--"} km/h
            </div>

            <div>
              Congestion Score:{" "}
              {dashboardData?.traffic?.congestion_score?.toFixed(2) ?? "--"}
            </div>
          </div>
        </article>

        {/* WEATHER */}
        <article
          className="grid gap-3 p-[18px] rounded-lg"
          style={{
            minHeight: 280,
            border: "1px solid var(--line)",
            background: "rgba(15,23,42,.62)",
            alignContent: "start",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
              fontSize: 11,
              fontWeight: 780,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Weather Forecast
          </span>

          <strong
            style={{
              fontSize: 27,
              lineHeight: 1.12,
            }}
          >
            {dashboardData?.weather?.weather_main ?? "--"}
          </strong>

          <div
            style={{
              color: "var(--text-soft)",
              fontSize: 15,
              lineHeight: 1.8,
            }}
          >
            <div>
              Temperature:{" "}
              {dashboardData?.weather?.temp_celsius?.toFixed(1) ?? "--"}°C
            </div>

            <div>
              Humidity:{" "}
              {dashboardData?.weather?.humidity_pct ?? "--"}%
            </div>

            <div>
              Visibility:{" "}
              {dashboardData?.weather?.visibility_meters ?? "--"} m
            </div>
          </div>
        </article>

        {/* RELIABILITY */}
        <article
          className="grid gap-3 p-[18px] rounded-lg"
          style={{
            minHeight: 280,
            border: "1px solid var(--line)",
            background: "rgba(15,23,42,.62)",
            alignContent: "start",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
              fontSize: 11,
              fontWeight: 780,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Reliability Forecast
          </span>

          <strong
            style={{
              fontSize: 27,
              lineHeight: 1.12,
            }}
          >
            {dashboardData?.reliability?.reliability ?? "--"}%
          </strong>

          <p
            style={{
              color: "var(--text-soft)",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Route Status:
            {" "}
            {dashboardData?.reliability?.route_status ?? "--"}
          </p>

          <p
            style={{
              color: "var(--text-soft)",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            {dashboardData?.reliability?.recommendation ?? "--"}
          </p>
        </article>

        {/* DELAY */}
        <article
          className="grid gap-3 p-[18px] rounded-lg"
          style={{
            minHeight: 280,
            border: "1px solid var(--line)",
            background: "rgba(15,23,42,.62)",
            alignContent: "start",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
              fontSize: 11,
              fontWeight: 780,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Delay Prediction
          </span>

          <strong
            style={{
              fontSize: 27,
              lineHeight: 1.12,
            }}
          >
            {dashboardData?.reliability?.delay_prediction ?? "--"} min
          </strong>

          <p
            style={{
              color: "var(--text-soft)",
              lineHeight: 1.55,
              fontSize: 14,
            }}
          >
            Delay risk estimated from traffic congestion,
            travel time variance and weather conditions.
          </p>
        </article>
        {/* COMMUTE COPILOT */}
<article
  className="grid gap-3 p-[18px] rounded-lg"
  style={{
    minHeight: 280,
    border: "1px solid var(--line)",
    background: "rgba(15,23,42,.62)",
    alignContent: "start",
  }}
>
  <span
    style={{
      color: "var(--muted)",
      fontSize: 11,
      fontWeight: 780,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
    }}
  >
    Commute Copilot
  </span>

  <strong
    style={{
      fontSize: 27,
      lineHeight: 1.12,
    }}
  >
    {recommendationData?.recommended_mode ?? "--"}
  </strong>

  <div
    style={{
      color: "var(--text-soft)",
      fontSize: 15,
      lineHeight: 1.8,
    }}
  >
    <div>
      Confidence: {recommendationData?.confidence ?? "--"}%
    </div>

    <div>
      Time Saved: {recommendationData?.estimated_time_saved ?? "--"} min
    </div>

    <div>
      {recommendationData?.reason ?? "--"}
    </div>
  </div>
</article>
      </div>
      {/* LIVE METRO INTELLIGENCE */}

<div className="mt-8">
  <h3
    style={{
      fontSize: "28px",
      fontWeight: 700,
      marginBottom: "20px",
    }}
  >
    Metro Station Intelligence
  </h3>

  <div
    className="grid gap-4"
    style={{
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    }}
  >
    {stations.map((station) => (
      <article
        key={station.name}
        className="p-[18px] rounded-lg"
        style={{
          border: "1px solid var(--line)",
          background: "rgba(15,23,42,.62)",
        }}
      >
        <h4
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          {station.name}
        </h4>

        <p style={{ marginBottom: "8px" }}>
          Crowd Level: <strong>{station.crowd}</strong>
        </p>

        <p style={{ marginBottom: "8px" }}>
          Delay: <strong>{station.delay}</strong>
        </p>

        <p>
          Status: <strong>{station.status}</strong>
        </p>
      </article>
    ))}
  </div>
</div>
    </motion.section>
  );
}