const mongoose = require('mongoose');
const initdata = require("./sampleListings.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//call the main() to connect with mongo
main().then( () => {
    console.log("connected successfully");
}).catch( err => {
    console.log(err);
});

//function to connect mongodb
async function main(){
    await mongoose.connect(MONGO_URL);
}

let newData = [];

for(let d of initdata["data"]){
   newData.push({
        title : d.title,
        description : d.description,
        image : d.image.url,
        price : d.price,
        location : d.location,
        country : d.country
   });
}

const init = async () => {
    await Listing.deleteMany({});
    newData =  newData.map((obj) => ({...obj,owner: "6684161050c81309199a1d8e"}));
    await Listing.insertMany(newData);
    console.log("successfull");
};

init();




  