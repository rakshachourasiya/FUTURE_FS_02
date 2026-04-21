require("dotenv").config({path:"./.env"});
const express = require("express");
const cors = require("cors");
const mysql =require("mysql2");
const app = express();
app.use(cors());
app.use(express.json());


const db=mysql.createConnection(process.env.MYSQL_PUBLIC_URL);
db.connect((err)=>{
  if(err){
    console.log("DB Error", err);
  } else {
    console.log("Railway DB Connected");

    // ✅ TABLE CREATE
    db.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        source VARCHAR(100),
        status VARCHAR(50),
        notes TEXT
      )
    `, (err) => {
      if(err) console.log("Table error", err);
      else console.log("Table ready ");
    });
  }
});

// POST API
app.post("/leads", (req, res) => {
  const { name, email, phone, source, status, notes } = req.body;
  const sql = `
    INSERT INTO leads (name, email, phone, source, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, source, status, notes], (err, result) => {
    if (err) return res.send(err);
    res.send({message:"Data saved ✅"});
  });
});

// GET API
app.get("/leads", (req, res) => {
  db.query("SELECT * FROM leads", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

//DELETE

app.delete("/leads/:id",(req,res)=>{
  const {id} =req.params;

  db.query("DELETE FROM leads WHERE id = ?",[id],(err)=>{
    if(err) return res.send(err);
    res.send({message:"Deleted"});
  })
})

//update

app.put("/leads/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE leads SET status=? WHERE id=?",
    [status, id],
    (err) => {
      if (err) return res.send(err);
      res.send({message:"Updated"});
    }
  );
});
app.listen(5000,()=>{
  console.log("Server runing on port 5000");
});





