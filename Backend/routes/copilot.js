const express = require("express");
const router = express.Router();
const axios = require("axios");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const dashboardRes = await axios.get(
      `${process.env.BACKEND_URL}/api/reliability/dashboard`
    );

    const recommendationRes = await axios.get(
      `${process.env.BACKEND_URL}/api/recommendation`
    );
const strategiesRes = await axios.get(
  `${process.env.BACKEND_URL}/api/strategies`
);

const strategiesData = strategiesRes.data;
    const dashboard = dashboardRes.data;
    const recommendation = recommendationRes.data;
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `
You are CommuteIQ AI.

Live Commute Data:

Reliability Score:
${dashboard.reliability.reliability}%

Delay Prediction:
${dashboard.reliability.delay_prediction} minutes

Traffic Congestion:
${dashboard.traffic.congestion_score}

Current Speed:
${dashboard.traffic.current_speed_kmph} km/h

Weather:
${dashboard.weather.weather_main}

Recommended Mode:
${recommendation.recommended_mode}

Recommendation Confidence:
${recommendation.confidence}%

Recommendation Reason:
${recommendation.reason}
Available Strategies:

${strategiesData.strategies
  .map(
    (s) =>
      `${s.label}
ETA: ${s.time}
Cost: ${s.price}
${s.stats.map(([k, v]) => `${k}: ${v}`).join(", ")}`
  )
  .join("\n\n")}
User Question:
${message}

Answer using the live commute data above.

Answer as CommuteIQ AI.

Use only the provided commute data.

Respond in bullet points.

Mention:
- Recommended action
- ETA impact
- Delay impact
- Confidence

Keep under 80 words.`,
});

const reply =
  response.candidates?.[0]?.content?.parts?.[0]?.text ||
  "No response generated";

return res.json({
  reply,
});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
});

module.exports = router;