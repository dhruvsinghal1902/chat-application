const express=require('express');
const router = express.Router();
const pool = require('./../db');

router.get('/', async (req,res) => {
  const allConnections= await pool.all(
    "SELECT c.*,u.username,u.status,u.created_on FROM users AS u INNER JOIN connections AS c ON c.other_user=u.USER_ID order by c.msg_status desc;",[],(err,rows)=>{
  res.send(JSON.stringify(rows, null, 4));
  })
});

router.get('/:user_id', async (req,res) => {
  const user= await pool.all(
    "SELECT c.*,u.username,u.status,u.created_on FROM users AS u INNER JOIN connections AS c ON c.other_user=u.USER_ID where c.user_id=? order by c.msg_status desc;",[req.params.user_id],(err,rows)=>{
  res.send(JSON.stringify(rows, null, 4));
})
});

router.get('/:room_key/:user_id', async (req,res) => {
  const connection = await pool.all(
    "SELECT * FROM connections WHERE room_no=? AND user_id=?;",
    [ req.params.room_key, parseInt(req.params.user_id) ],(rows,err)=>{

  res.send(JSON.stringify(rows, null, 4));})
});

router.put('/:status/:room_key/:user_id/', async (req,res) => {
  const msg_status =await pool.run(
    "UPDATE connections SET msg_status=? WHERE room_no = ? AND user_id=?;",
    [ req.params.status, req.params.room_key, parseInt(req.params.user_id) ],
  );
  return res.status(201).json("Message Status updated");
})

router.post('/', async(req,res) => {
  const details = req.body;
  console.log(details);
   const insertConnection = await pool.run(
     "INSERT INTO connections(user_id,room_no,msg_status,other_user) VALUES (?,?,?,?);",
      [ parseInt(details.user_id), details.room, details.msg_status, parseInt(details.other_user)  ]
   );
   const insertConnectionAgain = await pool.run(
    "INSERT INTO connections(user_id,room_no,msg_status,other_user) VALUES (?,?,?,?);",
     [ parseInt(details.other_user), details.room, details.msg_status,parseInt(details.user_id)  ]
  );
  return res.status(201).json("Connection Created");

});

module.exports=router;
