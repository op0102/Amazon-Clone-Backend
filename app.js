require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const app = express();
const PORT = process.env.PORT || 8005;
const cors =require("cors");
const morgan = require("morgan");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(cookieParser(""));
app.use(cors({
    origin:"*",
}));
app.use(morgan("dev"));

app.use(router);





app.get("/", (req, res) => {
    res.send("Hi! I am Omprakash Live")
});

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        
        app.listen(PORT, () => {
            console.log(`${PORT} Yes i am connected`);
        })
    } catch (error) {
        console.log(error);
    }
}
start();
