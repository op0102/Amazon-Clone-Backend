require("dotenv").config();
const productsdata = require("./constant/productdata");
const Products = require("./models/productsSchema");
const connectDB = require("./db/connect");



const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL);
        await Products.deleteMany();
        await Products.create(productsdata);
        console.log("sucessfully data added !!");
        
    } catch (error) {
        console.log(`failed to data added !! ${error.message}`);
        
    }
};

start();