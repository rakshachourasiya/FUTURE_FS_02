const express = require("express");
const cors = require("cors");
const mysql =require("mysql2");
const app = express();
app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"Raksha@24",
  database:"crm"
});
db.connect((err)=>{
  if(err){
    console.log("DB Erro",err);
  }else{
    console.log("MySQL Connected");
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
    res.send("Data saved ✅");
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
    res.send("Deleted");
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
      res.send("Updated");
    }
  );
});
app.listen(5000,()=>{
  console.log("Server runing on port 5000");
});





