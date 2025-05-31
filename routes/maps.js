const router = require("express").Router();
const userlocations = require("../models/Userlocations");

//not used yet

router.post("/", async (req, res) => {
  const newMessage = new userlocations(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/nearby-users", async (req, res) => {
  try {
    const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required" });
  }
  console.log("lat",lat)
  const users = await userlocations.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: 150000 // 5 km
      }
    }
  }).exec();
  console.log("nearbyusers",users)
  res.status(200).json(users);
    // const messages = await Userlocations.find({
    //   conversationId: req.params.conversationId,
    // });
    // res.status(200).json(messages);
  } catch (err) {
    console.error('Error finding nearby users:', err);
    res.status(500).json(err);
  }
});

// POST /api/location
router.post("/updatelocation", async (req, res) => {
  try {
    const { userid:useridlocation, latti:latitude, longi:longitude } = req.body;

    if (
      !useridlocation ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const locationData = {
      type: "Point",
      coordinates: [longitude, latitude], // NOTE: MongoDB expects [lng, lat]
    };

    // Update if exists, else insert
    const result = await userlocations.findOneAndUpdate(
      { useridlocation },
      { location: locationData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Location updated", data: result });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
