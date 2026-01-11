const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // assignments collections assessment
    const assignmentsCollection = client
      .db("jobAssessment")
      .collection("assignments");

    // add assignment
    app.post("/assignments", async (req, res) => {
      const newAssignments = req.body;
      console.log(newAssignments);
      const result = await assignmentsCollection.insertOne(newAssignments);
      res.send(result);
    });

    app.get("/assignments", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const cursor = assignmentsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get update route
    app.get("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentsCollection.findOne(query);
      res.send(result);
    });
    // update assignments
    app.put("/assignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAssignment = req.body;
      const assignment = {
        $set: {
          title: updatedAssignment.title,
          thumbnail: updatedAssignment.thumbnail,
          description: updatedAssignment.description,
          dueDate: updatedAssignment.dueDate,
          difficulty: updatedAssignment.difficulty,
          marks: updatedAssignment.marks,
        },
      };
      const result = await assignmentsCollection.updateOne(
        query,
        assignment,
        options
      );
      res.send(result);
    });

    // delete assignments
    app.delete("/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const userEmail = req.headers.email;
      const query = { _id: new ObjectId(id) };

      const assignment = await assignmentsCollection.findOne(query);

      if (!assignment) {
        return res.json({ error: true, message: "Assignment not found " });
      }
      if (assignment.email !== userEmail) {
        return res.json({
          error: true,
          message: "You are not allowed to delete this assignment",
        });
      }

      const result = await assignmentsCollection.deleteOne(query);
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
