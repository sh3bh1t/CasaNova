const mongoose=require("mongoose");
const initData= require(("./data.js"));
const Listing=require("../../CasaNova/models/listing.js");

const Mongo_URL="mongodb://127.0.0.1:27017/CasaNova";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URL);
}




const initDB = async ()=>{
     await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "66fea12588984e239c088dca",
     }));
     await Listing.insertMany(initData.data); 
     console.log("data was initialized");
}

initDB();