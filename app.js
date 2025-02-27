const express= require("express");
const app = express();
const mongoose = require("mongoose")
// const ejs = requrie("ejs")

const MONGO_URL = "mongodb://127.0.0.1:27017/test";
async function main() {
    await mongoose.connect(MONGO_URL);
    
}

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
})

app.get("/", (req,res)=>{
    res.send("working")
})

app.listen(8080, ()=>{
    console.log("server is listeneing on port 8080")
})