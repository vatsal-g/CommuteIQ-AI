const { MongoClient } = require("mongodb");
require("dotenv").config();

async function run() {
  try {
    console.log(process.env.MONGO_URI);

    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    console.log("✅ Connected");

    await client.close();

  } catch (err) {
    console.error(err);
  }
}

run();