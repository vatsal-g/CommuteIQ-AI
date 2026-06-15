const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {

    const dashboardRes = await axios.get(
      "http://localhost:5000/api/reliability/dashboard"
    );

    const recommendationRes = await axios.get(
      "http://localhost:5000/api/recommendation"
    );

    const dashboard = dashboardRes.data;
    const recommendation = recommendationRes.data;

    const reliability =
      dashboard.reliability.reliability;

    const delay =
      dashboard.reliability.delay_prediction;

    const congestion =
      dashboard.traffic.congestion_score;

    const strategies = [
      {
        letter: "A",
        label: "Fastest",
        time: `${40 + delay} min`,
        price: "Rs120",
        recommended: false,
        stats: [
          ["Reliability", `${Math.max(reliability - 5, 0)}%`],
          ["Mode", "Metro + Auto"],
          ["Stress Score", "7/10"],
          [
            "Crowd Level",
            congestion > 2 ? "High" : "Medium"
          ]
        ]
      },
      {
        letter: "B",
        label: "Budget",
        time: `${55 + delay} min`,
        price: "Rs55",
        recommended: false,
        stats: [
          ["Reliability", `${Math.max(reliability - 2, 0)}%`],
          ["Mode", "Metro"],
          ["Stress Score", "5/10"],
          ["Crowd Level", "Medium"]
        ]
      },
      {
        letter: "C",
        label: "Comfort",
        time: `${48 + Math.floor(delay / 2)} min`,
        price: "Rs75",
        recommended:
  recommendation.recommended_mode === "Current Route",
        stats: [
          ["Reliability", `${reliability}%`],
          ["Mode", "Metro + Carpool"],
          ["Stress Score", "2/10"],
          ["Crowd Level", "Low"]
        ]
      },
      {
  letter: "D",
  label: "Green",
  time: `${52 + delay} min`,
  price: "Rs40",
  recommended: false,
  stats: [
    ["Reliability", `${Math.max(reliability - 1, 0)}%`],
    ["Mode", "Metro + Walk"],
    ["Stress Score", "4/10"],
    ["CO2 Saved", "1.8 kg"]
  ]
}
    ];

    res.json({
      recommendation,
      strategies
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to generate strategies"
    });

  }
});

module.exports = router;