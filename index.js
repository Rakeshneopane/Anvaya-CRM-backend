require('dotenv').config();

const express = require("express");
const cors = require("cors");
const initailiseDatabase = require("./dbConnect/dbConnect");

const tagRoutes = require("./routes/tagRoutes");
const leadRoutes = require("./routes/leadRoutes");
const agentRoutes = require("./routes/agentRoutes");
const reportRoutes = require("./routes/reportRoutes");

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

//process.env.FRONTEND_URL

app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

initailiseDatabase();

app.get("/", (req,res)=>{
    res.send("Anvaya CRM API is working");
});

app.get("/protected-route", ClerkExpressRequireAuth(), (req, res) => {
    res.json({ userId: req.auth.userId })
})

app.use("/api", ClerkExpressRequireAuth(), tagRoutes);
app.use("/api", ClerkExpressRequireAuth(), leadRoutes);
app.use("/api", ClerkExpressRequireAuth(), agentRoutes);
app.use("/api", ClerkExpressRequireAuth(), reportRoutes);


app.use((err, req, res, next) => {
  console.error("Error caught:", err.message, err.status || err.statusCode);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});


// app.listen(PORT, ()=>{
//     console.log("Listening to port", PORT);
// })

module.exports = app;
