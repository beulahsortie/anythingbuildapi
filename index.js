const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const mapsRoute = require("./routes/maps");
const emailotpRoute = require("./routes/emailotp");
const router = express.Router();
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Change this to your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
dotenv.config();
// MONGO_URL=mongodb+srv://3231811912y204:kwjEwyiI4H5f5WIZ@rusty584.wklrs.mongodb.net/
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
const storage = multer.memoryStorage();
const upload = multer({ storage });
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});



app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;console.log("file....",req.file)
  if (!file) return res.status(400).json({ message: "No file uploaded." });
  const uniqueFileName = `${Date.now()}_${file.originalname}`;
  try {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        //ACL: "public-read", // optional
      },
    });

    const result = await upload.done();console.log("result..",result)
    return res.status(200).json({ message: "Upload successful", url: result.Location });
  } catch (err) {
    console.error("S3 upload failed:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});


app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/maps", mapsRoute);
app.use("/api/emailotp", emailotpRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
app.get('/',(req,res)=> res.json('my api running'));