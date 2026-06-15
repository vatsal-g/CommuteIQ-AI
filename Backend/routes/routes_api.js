const express = require("express");
const router = express.Router();

const RouteOption =
require("../RouteOption");

router.get("/", async (req, res) => {

  try {

    const routes =
      await RouteOption.find();

    let recommended = routes[0];

    for (let r of routes) {

      if (
        r.reliability >
        recommended.reliability
      ) {
        recommended = r;
      }

    }

    res.json({
      routes,
      recommended
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;