const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const routesApi =
require("./routes/routes_api");
const reliabilityRoutes =
require("./routes/reliability_route");
const recommendationRoutes =
require("./routes/recommendation_route");
const copilotRoutes =
require("./routes/copilot");
const strategyRoutes =
require("./routes/strategy_route");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api/strategies",
  strategyRoutes
);
app.use(
  "/api/copilot",
  copilotRoutes
);

// MongoDB connection diagnostics
const uri = process.env.MONGO_URI;

console.log("MONGO_URI exists:", Boolean(uri));

try {
  if (uri) {
    const parsed = new URL(uri);

    console.log("Mongo hostname:", parsed.hostname);
    console.log("Username present:", Boolean(parsed.username));
    console.log("Password present:", Boolean(parsed.password));
    console.log("Database path:", parsed.pathname);
  }
} catch {
  console.error("MONGO_URI is malformed");
}

// MongoDB connection
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB Connected");
    console.log(
      "Database Name:",
      mongoose.connection.db.databaseName
    );
  })
  .catch(err => {
    console.error("Mongo Error:", err.message);
  });
app.use(
  "/api/reliability",
  reliabilityRoutes
);

app.use(
  "/api/recommendation",
  recommendationRoutes
);
app.use(
 "/api/routes",
 routesApi
);

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});