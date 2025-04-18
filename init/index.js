const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
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



const initDB = async()=>{
    await Listing.deleteMany({})

    //a simple hack when was trying out authorization 
    // and wanted to add owner obj ref to each listing in each listing
    initData.data = initData.data.map((obj)=>({...obj, owner:'68009bab79df00b54f5f72ec'}))

    await Listing.insertMany(initData.data)

    console.log("init/index.js : data was initialized")
}

initDB()