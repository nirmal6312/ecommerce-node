const mongoose = require("mongoose");


const Productschema = new mongoose.Schema({
 
  pname: {
    type: String,
  },
  price: {
    type: Number,
  },
  description:{
    type:String
  },
  img:{
    data: Buffer,
    contentType: String
  }
});


module.exports =  mongoose.model("products", Productschema);
