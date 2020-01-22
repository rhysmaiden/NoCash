const mongoose = require("mongoose");

// Connect to MongoDB

mongoose.connect(
  "mongodb+srv://rhysmaiden:slinky123@cluster0-gaw5f.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoDB");
  })
  .on("error", error => {
    console.log("Mongo Connection Error: ", error);
  });

module.exports = { mongoose };
