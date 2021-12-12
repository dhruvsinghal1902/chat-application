const express=require('express');
const router = express.Router();
const pool = require('./../db');
const path= require('path');
const fs= require('fs');
const { route } = require('./users');


router.get('/', async (req,res) => {
  const allMessages= await pool.all(
    "SELECT * from messages;",[],(err,rows)=>{
 res.send(JSON.stringify(rows, null, 4));
})

});

router.get('/:room_key', async (req,res) => {
  const messagesByRoom = await pool.all(
    "SELECT * FROM messages WHERE room_key=? ORDER BY sent_on;",
    [ req.params.room_key ],(err,rows)=>{
 res.send(JSON.stringify(rows, null, 4));
})


});

router.get('/count/:room_key', async(req,res) => {
  const countOfMessages = await  pool.get(
    "SELECT count(message) FROM messages WHERE room_key=?;",
    [ req.params.room_key ],(err,rows)=>{
 res.send(JSON.stringify(rows, null, 4));
})


});

router.post('/',async (req,res) => {
  const messageInfo= req.body;
  console.log("MessageInfo",messageInfo);

  const createMessage = await pool.run(
    "INSERT INTO messages(room_key,sent_by,message) VALUES (?,?,?);",
    [messageInfo.Room, messageInfo.sent_by, messageInfo.Message ],
  )
  return res.status(201).json("Message Created");
})


module.exports=router;
