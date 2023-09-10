const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const Usermodel = require('./models/Usermodel')
const useroute = require('./routes/userRoute')
const postroute = require('./routes/postRoute')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()


const app = express()

app.use(express.static("images"))



// Parse incoming JSON data

// Connect to MongoDB

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });

    app.use(bodyParser.json())
app.use(cors())

app.use('/user',useroute)
app.use('/recipe',postroute)


const port = 3800;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})