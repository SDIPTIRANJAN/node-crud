const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

async function connectDB() {
  await client.connect();

  console.log("MongoDB Connected");

  return client.db("studentDB");
}

module.exports = connectDB;
