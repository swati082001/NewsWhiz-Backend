const express = require("express");
const bodyParser = require('body-parser');
const chatRoutes = require("./routes/chat");
const cors = require("cors");
require("dotenv").config()

const PORT = process.env.PORT || 3000;
const app = express()

//Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use("/api/chat",chatRoutes);

app.get("/",(req,res)=>{
    res.send("Home page")
})

app.listen(PORT,()=>{
    console.log(`The App is running on PORT ${PORT} `)
})