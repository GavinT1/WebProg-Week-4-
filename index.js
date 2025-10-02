import express from "express";
import dotenv from "dotenv";
import mongodb from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongodb setup here
const client = new mongodb.MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGO_DBNAME || "retail-store";
const db = client.db(dbName);
const customerCollections = db.collection("customers");

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Failed to connect to the database: ", error);
    process.exit(1);
  }
}

//Routes Here
app.get("/customers", async (req, res) => {
  try {
    const { username, email } = req.query; //keyvalue pair
    let filter = {};

    if (username) filter.username = username;
    if (email) filter.email = email;

    const customer = await customerCollections.find(filter).toArray();

    res.status(200).json({
      data: customer,
      message: "Customers retrieved successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error.", error: error.message });
  }
});
//Retail Store

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});