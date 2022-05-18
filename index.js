const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

// ============ Middleware ======
app.use(cors());
app.use(express.json());

// ========= Mongo Connect ======
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.d2tji.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("tasks").collection("task");

    // ========= Show API =======
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    // ========= Add API =======
    app.post("/add", async (req, res) => {
      const data = req.body;
      const result = await taskCollection.insertOne(data);
      res.send({ result });
    });

    // ========= Specific User Product API =======
    app.get("/userTask", async (req, res) => {
      const uid = req.headers.uid;

      const query = { uid: uid };
      const cursor = await taskCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    // ========= Delete Product API =======
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectID(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    //
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Test Server is Running");
});

app.listen(port, () => {
  console.log("Port is Running", port);
});
