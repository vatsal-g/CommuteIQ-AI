const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {},
  { strict: false }
);

module.exports = mongoose.model(
  "RouteOption",
  RouteSchema,
  "route_options"
);