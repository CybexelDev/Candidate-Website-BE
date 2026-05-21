require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const connectDB=require("./Config/db")
const adminRoutes=require("./Routes/adminRoutes")
const userRoutes=require("./Routes/userRoutes")
const app=express()

connectDB()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
  "/Uploads",
  express.static("Uploads")
);
app.use("/api/admin", adminRoutes);
app.use("/api/user",userRoutes)
const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.send("Candidate Document Submission API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


   