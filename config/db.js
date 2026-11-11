const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in environment variables!");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    if (error.name === "MongooseServerSelectionError") {
      console.warn("\n⚠️  [MongoDB Atlas IP Access Notice]");
      console.warn("If you are getting a timeout or ServerSelectionError, please ensure your IP address is whitelisted in MongoDB Atlas:");
      console.warn("1. Go to https://cloud.mongodb.com/");
      console.warn("2. Navigate to 'Network Access' -> 'IP Access List'");
      console.warn("3. Click 'Add IP Address' -> Add '0.0.0.0/0' (allow from anywhere) or click 'Add Current IP Address'");
      console.warn("4. Wait 1-2 minutes for the changes to apply, then restart this server.\n");
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected.");
});

module.exports = connectDB;
