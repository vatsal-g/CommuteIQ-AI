const mongoose = require("mongoose");

const ReliabilitySchema = new mongoose.Schema(
  {},
  { strict: false }
);

module.exports = mongoose.model(
  "Reliability",
  ReliabilitySchema,
  "reliability_scores"
);