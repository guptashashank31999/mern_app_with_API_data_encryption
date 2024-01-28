const express = require("express");
require("./db/config");
const cors = require("cors");
const User = require("./db/User");
const Product = require("./db/Product");
const UserModel = require("./db/UserImageModel");
const newCredentials = require("./db/UserCredentials")
const app = express();
const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";

const crypto = require('crypto-js');
const encryptionKey = 'YourEncryptionKe'; 

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const https = require("https");
const fs = require("fs");

const multer = require("multer");
const path = require("path");

const {encryptFunction} = require('./EncryptFunctionCall')

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  
  Jwt.sign({ result }, jwtKey, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      res.send({ result: "Something Went wrong" });
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  console.log("first-req.body", req.body);
  
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          res.send({ result: "Something Went wrong" });
        }
        
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "No User Found" });
    }
  } else {
    res.send({ result: "Email And Password are mendotery" });
  }
});


app.post("/add-product", async (req, res) => {
 
  let product = new Product({
    name : req.body.name,
    price : req.body.price,
    category : req.body.category,
    description : req.body.description,
    company: req.body.company,
    image: req.body.image,
    userId : req.body.userId
  });
  let result = await product.save();
  res.json(result);
});

const storage = multer.diskStorage({
  destination: (req, file , cb) =>{
      cb(null , 'public/Images')
  },
  filename: (req, file, cb) =>{
    console.log("Filename storage",file)
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer(
  {
      storage:storage
  }
)

app.post("/uploadImage", upload.single("file"), (req, res)=>{
  
      UserModel.create({image : req.file.filename}).then(result => res.json(result) ).catch(error => console.log("Err",err));
})
// app.post("/add-product", upload.single('file'), (req, res) => {
//     console.log("req.body-axios",req.body);
//     console.log("req.file",req.file)
//   Product.create({
//     name: req.body.name,
//     price: req.body.price,
//     category: req.body.category,
//     userId: req.body.userId,
//     company: req.body.company,
   
//   }).then(result => res.json(result)).catch(error => console.log(error))
// });
app.get("/products", async (req, res) => {
  
  
    let products = await Product.find();
    let encryptData = crypto.AES.encrypt(JSON.stringify(products), encryptionKey).toString();
    // console.log("encrypt---data", encryptData);
    // console.log("products-63",products);
    if (products.length > 0) {
    res.json({encryptData});
  } else {
      res.send({ result: "No products found" });
    }
  });
  

  app.post("/productsEncrypt", async (req, res) => {
    console.log("req.body-line123",req.body.visible);
    console.log("line124", req.body.userId);
    let visible = req.body.visible;
    let products = await Product.find({userId : req.body.userId});
    if(visible === true){
     
      if (products.length > 0) {
      res.send(products);
    } else {
        res.send({ result: "No products found" });
      }
    }else{
      let encryptData = encryptFunction(products)
      if (products.length > 0) {
      res.json({encryptData});
    } else {
        res.send({ result: "No products found" });
      }
    }
  
  });

 


  // app.get("/products", async (req, res) => {
    
    
  //   let products = await Product.find();
    
  //   if (products.length > 0) {
  //     res.send(products);
  //   } else {
  //     res.send({ result: "No products found" });
  //   }
  // });
  app.post("/products", async (req, res) => {
    let bodyData = req.body.userId;
    let product = await Product.find({ userId: bodyData });
    if (product) {
      res.send(product);
    } else {
      res.send("No Data Found");
    }
  });
  
app.delete("/product/:id", verifyToken, async (req, res) => {
  res.send(req.params.id);
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", verifyToken, async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id });
  
  if (product) {
    res.status(200).send(product);
  } else {
    res.send({ result: "Result Not Found" });
  }
});

app.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: req.body,
    }
    );
    
    res.send(result);
  });

  app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find({
      $or: [
        { name: { $regex: req.params.key } },
        { company: { $regex: req.params.key } },
      ],
    });
    res.send(result);
  });

  app.get("/newCredentials", async (req, res) =>{
      let result = await newCredentials.find();

      res.send(result);
  })
  
  function verifyToken(req, res, next) {
    let token = req.headers["authorization"];
    console.log("token---", token);
    if (token) {
      token = token.split(" ")[1];
      console.log("token", token);
      Jwt.verify(token, jwtKey, (err, valid) => {
       
        // if (err) {
          //   res.status(401).send({ result: "Please add valid token" });
          // } else {
            //   next();
            // }
            next();
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}

app.listen(8000);

// https.createServer({
// key : fs.readFileSync("key.pem"),
// cert: fs.readFileSync("cert.pem")
// },app).listen(8000,()=>{

//   console.log('server is runing at port 4000');
  

// })
