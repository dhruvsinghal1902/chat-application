const express= require('express');
const app=express();
const pool = require('./db');
const cors = require('cors');
const corsOptions ={
     origin:'*',
     credentials:true,            //access-control-allow-credentials:true
     optionSuccessStatus:200,
  }
app.use(cors(corsOptions)) // Use this after the variable declaration

const bodyParser = require('body-parser');
const formData = require('express-form-data');

const PORT= process.env.PORT || 5050;

// app.use(cors({
//   origin: '*'
// }))
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
//   });


// app.use((req,res,next) => {
//   res.setHeader("Content-Type",'application/json');
//   next();
// });



app.use(express.json());
app.use(formData.parse());

app.use("/users", require('./routes/users.js'));
app.use("/connections", require('./routes/connections.js'));
app.use("/messages", require('./routes/messages.js'));

app.listen(PORT, () => {
  console.log(PORT);
})
