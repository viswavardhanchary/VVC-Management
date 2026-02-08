const mongoose = require('mongoose');
require('dotenv').config();

const connectionURI = process.env.MONGO_URI;

const connectionDB = async () => {
  try {
    const response = await mongoose.connect(connectionURI);
    console.log("MongoDB Connected!");
  }catch(e) {
    console.log(e);
  }
  
}

module.exports = connectionDB;