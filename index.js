const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_BD}:${process.env.USER_PASS}@cluster0.qha6rup.mongodb.net/?appName=Cluster0`;

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

    // assignments collection related apis
    const assignmentsCollection = client
      .db("jobAssessment")
      .collection("assignments");

      // add assignments 
    app.post("/assignments", async (req, res) => {
      const newAssignments = req.body;
      console.log(newAssignments)
      const result = await assignmentsCollection.insertOne(newAssignments);
      res.send(result);
    });

    app.get("/assignments", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if(email) {
        query = {hr_email: email}
      }
      const cursor = assignmentsCollection.find(query);
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
