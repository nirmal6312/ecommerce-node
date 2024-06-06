const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema({
  // email field
  username:{
    type: String,
    required: [true, "Please provide an username!"],
    unique: [true, "Email username"],
  },
  phone:{
    type: Number,
    required: [true, "Please provide an phone number!"],
    unique: [true, "phone Exist"],
  },
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
