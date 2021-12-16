const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcafd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri);

async function run() {
  try {
    await client.connect();
    // console.log("connected database");
    const database = client.db("TravelAgency");
    const packageCollection = database.collection("package");
    const orderCollection = database.collection("order");
    const galleryCollection = database.collection("gallery");

    // GET API
    app.get("/packages", async (req, res) => {
      const package = packageCollection.find({});
      // console.log(service);
      const packages = await package.toArray();
      // console.log(services);
      res.send(packages);
    });

    // getting single package
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await packageCollection.findOne(query);
      res.json(service);
    });

    // getting  order
    app.get("/orders", async (req, res) => {
      const order = orderCollection.find({});
      const orders = await order.toArray();
      res.json(orders);
    });

    // gallery api
    app.get("/gallery", async (req, res) => {
      const photo = galleryCollection.find({});
      const photos = await photo.toArray();
      res.json(photos);
    });

    // POST API
    app.post("/booking", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);
      const result = await orderCollection.insertOne(service);
      // console.log('Got the services',result);
      res.json(result);
    });

    // // DELETE API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log(query);
      const result = await orderCollection.deleteOne(query);
      console.log("deleting the Order with id: ", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Travel Agent!"));
app.listen(port, () =>
  console.log(`Travel Agent app listening on port ${port}!`)
);
