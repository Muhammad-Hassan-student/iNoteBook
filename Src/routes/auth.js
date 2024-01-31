//express
const express = require("express");
const User_mod = require("../model/User");
//express se router
const router = express.Router();
//validation
const { body, validationResult } = require("express-validator");
//bcrypt js for hash and salt password
const bcrypt = require("bcryptjs");
//jwt require
var jwt = require("jsonwebtoken");
//fetchuser require
var fetchuser = require("../middleware/fetchuser");
//               ********

//JWT SECRET STRING
const JWT_SECRET = "HassanIsAintelligentBoy";

//route 1 for create user
//create a user by using --Post _"/api/auth/createuser".No login required

router.post(
  "/createuser",
  [
    body("name", "Enter your name minimum 3 character").isLength({ min: 3 }),
    body("email", "Enter your valid email").isEmail(),
    body("password", "Enter your password minimum 5 character").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    //if there are errors ,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether the user with this email exists already
      let user = await User_mod.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist" });
      }

      //hash passwor and salt password syntax
      const salt = await bcrypt.genSaltSync(10);
      const Secpassword = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User_mod.create({
        name: req.body.name,
        password: Secpassword,
        email: req.body.email,
      });
      //   .then(user => res.json(user))
      //   .catch(err=>{console.log(err)
      // res.json({err: 'please enter a unique value for email',message: err.message})})

      //json web token || user ki id
      const data = {
        user: {
          id: User_mod.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // res.json({user});

      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//route 2 for login user
//authentication the user by using email and password --Post _"/api/auth/login".No login required

router.post(
  "/login",
  [
    body("email", "Enter your valid email").isEmail(),
    body("password", "Cannot be blank a password").exists(),
  ],
  async (req, res) => {
    //if there are errors ,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //for email login (video 50)
      let user = await User_mod.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login correct credentials" });
      }

      //for  password to compare user password and store password

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login correct credentials" });
      }

      //send data to user

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(200).json({ authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error Login try error");
    }
  }
);

//rout 3 for get user
//Getuser the user by using email and password --Post _"/api/auth/Getuser". login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req. user.id;
    const user = await User_mod.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error bvgfgt");
  }
});
module.exports = router;
