const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(`
You are CommuteIQ AI.

User Question:
${message}

Answer as a commute intelligence assistant for Delhi NCR.

Keep answer under 100 words.
`);

    res.json({
      reply: result.response.text()
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "AI service unavailable"
    });

  }
});

module.exports = router;