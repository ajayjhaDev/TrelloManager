const mongoose = require('mongoose')
const conn = async ()=>{
    try{
        const response = await mongoose.connect(`${process.env.MONGO_URI}`);
        if(response){
            console.log("Connected to db"); 
        }
    }
    catch(err){
        console.log(err)
    }
}
conn();