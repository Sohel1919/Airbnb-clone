//Require Packages & Models
const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
//Stablish connection with database
main()
  .then(()=>console.log("successfully connection stablish with database"))
  .catch((err)=>console.log("ERROR: ",err))
  async function main() {
  await mongoose.connect("mongodb://localhost:27017/airbnb")
};

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj , owner:'6798e70497852e17105077fc'}))
  await Listing.insertMany(initData.data);
  console.log("Data Init");
}
initDB();