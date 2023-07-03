const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT;
app.use(bodyParser.json());

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itinerarySchema = new mongoose.Schema({
  days: String,
  city: String,
  itinerary: String,
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

app.post("/api/saveItinerary", async (req, res) => {
  try {
    const { days, city, itinerary } = req.body;

    const newItinerary = new Itinerary({
      days,
      city,
      itinerary,
    });

    await newItinerary.save();

    res.status(200).json({ message: "Itinerary saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/api/getItineraries", async (req, res) => {
  try {
    const itineraries = await Itinerary.find();

    res.status(200).json(itineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/api/recentSearches", async (req, res) => {
  try {
    const recentSearches = await Itinerary.find().sort({ _id: -1 }).limit(5);

    res.status(200).json(recentSearches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.listen(PORT, (Error) => {
  console.log(`Application listening on PORT ${PORT}`);
});


