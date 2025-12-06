const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// assessment
// 52cC4Qkg8lhB7u0R

const uri = `mongodb+srv://${process.env.USER_BD}:${process.env.USER_PASS}@cluster0.qha6rup.mongodb.net/?appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // jobs related apis
    const assignmentsCollection = client.db("jobAssessment").collection("assignments");

    app.get("/assignments", async (req, res) => {
      const cursor = assignmentsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    //  await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Job assessment running");
});

app.listen(port, () => {
  console.log(`job assessment ${port}`);
});
