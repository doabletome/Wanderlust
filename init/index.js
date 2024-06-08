const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // now i want owner field to be added in eacg object
  //one method was that i add owner field manually to each obj in data.js
  // another better method is that i map each obj of data to each obj and store thi sown data to init.data
  initData.data = initData.data.map((obj)=>({...obj,owner:"6607b7ba21681a8dc1c94064"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();