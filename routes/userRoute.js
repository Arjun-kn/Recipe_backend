let express = require("express");
let router = express.Router();
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require('dotenv').config()

const Users = require("../models/Usermodel");

// Register new user

router.post("/register" , async (req, res) => {
  const { email, password } = req.body;
  try {
    const exitingUser = await Users.findOne({ email });
    if (exitingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

  console.log(exitingUser)
    // hash password

    const hashPassword = await bcrypt.hash(password, 10);

    // create new user

    const newUser = new Users({
      email,
      password: hashPassword,
    });

    console.log(newUser)

    await newUser.save();
    res.status(201).json({ message: "User registered successfully"});
  } catch (err) {
    res.status(500).json(err.message);
  }
});


// Login

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    try{
     // find user by email

     const user = await Users.findOne({email})
    //  console.log(user)

     if(!user){
        return res.status(401).json({message:'User not found'})
     }

     // compare Password

     const isPasswordValid = await bcrypt.compare(password,user.password);
     if(!isPasswordValid){
        return res.status(401).json({message:'Invalid credential'})
     }

     // Generate JWT token

    const token = jwt.sign({id:user._id},process.env.SKEY,{expiresIn:'3d'})
   
    res.json({token})


    }catch(err){
        res.status(500).json({message:'Internal server error'})
    }
})



router.get("/user-details/:id",  async (req, res) => {
  try {
    // The authMiddleware should have already added the user object to the request (req.user) if the token is valid.
    // You can now send back the user details.

    const userId = req.params.id; // Extract the user ID from the request parameters

    // Use the `findById` function to retrieve the user by ID
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router