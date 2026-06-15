const express = require("express");
const router = express.Router();

const Reliability = require("../reliability");
const mongoose = require("mongoose");

// Reliability endpoint
router.get("/", async (req, res) => {

  try {

    const latest = await Reliability
      .findOne()
      .sort({ _id: -1 });

    res.json({
      reliability: latest.reliability,
      delay_prediction: latest.delay_prediction
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// Dashboard endpoint
router.get("/dashboard", async (req, res) => {

  try {

    const reliability =
      await Reliability.findOne().sort({ _id: -1 });

    const traffic =
      await mongoose.connection.db
        .collection("traffic_realtime")
        .findOne({}, { sort: { _id: -1 } });

    const weather =
      await mongoose.connection.db
        .collection("weather_realtime")
        .findOne({}, { sort: { _id: -1 } });

    res.json({
      reliability,
      traffic,
      weather
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;