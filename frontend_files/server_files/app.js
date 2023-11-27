// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET_KEY = "sudygfuysdfgsydufgsdguf123b5"
// app.use(cors());
// app.use(express.json());

// const mongoUrl = "mongodb+srv://admin:admin@test.icnqxix.mongodb.net/?retryWrites=true&w=majority";

// mongoose
//   .connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true, // You might want to add this option
//   })
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch((e) => console.log(e));

// require('./userDetails');
// const User = mongoose.model("UserInfo");

// app.post("/register", async (req, res) => {
//     const { fname, lname, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//       const oldUser = await User.findOne({email});
//       if (oldUser){
//         return res.json({error:"User already exists"})
//       }
//       console.log("Received request:", req.body);
  
//       await User.create({
//         fname,
//         lname,
//         email,
//         password: hashedPassword,
//       });
  
//       res.send({ status: 'ok' });
//     } catch (error) {
//       res.send({ status: 'error' });
//     }
//   });
//   app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
  
//       const user = await User.findOne({ email });
//       if(!user){
//         return res.json({error: "User not found"});
//       }
//       if(await bcrypt.compare(password, user.password)){
//         const token = jwt.sign({email:user.email},JWT_SECRET_KEY);
//         if(res.status(201)){
//           return res.json({status: 'ok',data: token});
//         }else{
//           return res.json({error: 'error'});
//         }
//       }
//       res.json({status:"error",error:"Invalid Password"})
      
//     });
// app.post("/user", async (req, res) => {
//   const {token} = req.body;
//   try {
//     const user= jwt.verift(token,JWT_SECRET_KEY);
//     const useremail = user.email;
//     User.findOne({email:useremail}).then((data)=>{
//       res.send({status:"ok", data:data});
//     }).catch((error)=>{
//       res.send({status:"error",data:error});
//     });
//   } catch (error) {
    
//   }
// })
// app.listen(5000, () => {
//   console.log("Server started on port 5000.");
// });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = "sudygfuysdfgsydufgsdguf123b5";

app.use(cors());
app.use(express.json());

const mongoUrl = "mongodb+srv://admin:admin@test.icnqxix.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.log(e));

require('./userDetails');
const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    res.json({ status: 'ok' });
  } catch (error) {
    console.error("Error during registration:", error);
    res.json({ status: 'error' });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);

      res.json({ status: 'ok', data: token });
    } else {
      res.json({ status: "error", error: "Invalid Password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.json({ status: 'error', error: error.message });
  }
});

app.post("/user", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    const useremail = user.email;

    const data = await User.findOne({ email: useremail });

    res.json({ status: "ok", data });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.json({ status: "error", data: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000.");
});
