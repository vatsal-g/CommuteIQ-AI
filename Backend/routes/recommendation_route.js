const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

router.get("/", async (req, res) => {

  try {

    const latest =
      await mongoose.connection.db
        .collection("commute_recommendations")
        .findOne({}, { sort: { _id: -1 } });

    res.json(latest);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;