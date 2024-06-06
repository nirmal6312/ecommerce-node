const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const auth = require("./auth");
const Productschema = require("./db/productmodel")
const multer = require("multer")
const fs = require("fs")
// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cors configuration
app.use(cors((origin = "*")));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.rpassword, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.remail,
        password: hashedPassword,
        username:request.body.username,
        phone:request.body.phone,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch erroe if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).json({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).json({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

//all users get for dashboard
app.get("/allusers",async(req,res)=>{
  const getusers = await User.find();
  res.send(getusers);
})

const storage = multer.diskStorage({
  destination : (req,file,cb)=>{
      cb(null,'image/');
  },
  filename : (req,file,cb)=>{
      cb(null, file.originalname);
  }
})

const upload = multer({storage : storage})


//product upload
app.post("/addproduct",upload.single('file'),(req,res)=>{
  try{
      const cdata = Productschema ({
          img : {
              data : fs.readFileSync('image/' + req.file.filename),
              contentType : 'image/',
          },
          pname : req.body.pname,
          price : req.body.price,
          description : req.body.description,
      })
  cdata.save()
  if(cdata){
      res.status(200).json({
          cdata:cdata,
          status : true,
          message : "Card create successfully"
      })
  }
  else{
      res.status(404).json({
          status:false,
          message : "Something went wrong" 
      })
  }
  }
  catch(e){
      console.log(e,"error")
  }
})

app.get("/getproduct",  async(request, response) => {
  const getproduct = await Productschema.find();
  response.send(getproduct);
});

module.exports = app;
