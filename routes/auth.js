const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });console.log("boddy",req.body);

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("boddy",req.body);
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);console.log("ans",validPassword)
    !validPassword && res.status(400).json("wrong password")

    const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({token,user})
  } catch (err) {
    console.log("errrrr0r")
    res.status(500).json(err)
  }
});

module.exports = router;
