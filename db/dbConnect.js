const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
    family:4,
    
    })
    .then(() => {
      console.log("Successfully connected to MongoDB!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;


// technoglobe63
// 4JxxNwQHN5v55gtV