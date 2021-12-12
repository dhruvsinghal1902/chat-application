const express=require('express');
const router = express.Router();
const pool = require('./../db');
var sqlite3 = require('sqlite3').verbose()


router.get('/', async (req,res) => {
  const allUsers= await pool.all(
    "SELECT * from users;",[],(err,rows)=>{
 res.send(JSON.stringify(rows, null, 4));
})

});

router.get('/:user_id', async (req,res) => {
  const user= await pool.all(
    "SELECT * from users where user_id=?;",[req.params.user_id],(err,rows)=>{
 res.send(JSON.stringify(rows, null, 4));
})

});

router.put('/:status/:user_id', async (req,res) => {
  const user= await pool.run(
    "UPDATE users SET status=? WHERE user_id=?;",[ req.params.status,parseInt(req.params.user_id)],
  );
  console.log("Updated");
  return res.status(201).json("Status updated");
});

router.post('/',async (req,res) => {
  const messageInfo= req.body;
  console.log("MessageInfo",messageInfo);

  const createMessage = await pool.run(
    "INSERT INTO users(username,email,pwd) VALUES (?,?,?);",
    [messageInfo.Username, messageInfo.Email, messageInfo.Pwd ],
  )
  return res.status(201).json("User Registered");
})

module.exports=router;
