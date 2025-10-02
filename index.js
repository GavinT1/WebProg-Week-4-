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

app.get("/customers", async (req, res) => {
   });

app.post("/customers", async (req, res) => {
  try {
    const { username, email, phone, password, first_name, last_name,address } = req.body;
  
    if( !username || !email || !password || !first_name || !last_name){
      return res.status(400).json({message: "Missing required fields.",
      fields: {username, email, password, first_name, last_name},
      });
    }

    const newCustomer = { ...req.body, created_at: new Date() };
    const result = await customerCollections.insertOne(newCustomer);
    

    res.status(201).json({
      data: result,
      message: "Customer created successfully.",
    });
  } catch(error) {
    res 
      .status(500)
      .json({ message: "Internal Server Error.", error: error.message });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    const { username, email, phone, password, first_name, last_name,address } = req.body;
  
    if( !username || !email || !password || !first_name || !last_name){
      return res.status(400).json({message: "Missing required fields.",
      fields: {username, email, password, first_name, last_name},
      });
    }

    const customerID = new mongodb.ObjectId(req.params.id);
    const updatedCustomer = { ...req.body, updated_at: new Date() };
    const result = await customerCollections.updateOne(
      { _id: customerID },
      { $set: updatedCustomer }
    );
    

    res.status(201).json({
      data: result,
      message: "Customer created successfully.",
    });
  } catch(error) {
    res 
      .status(500)
      .json({ message: "Internal Server Error.", error: error.message });
  }

});



connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});