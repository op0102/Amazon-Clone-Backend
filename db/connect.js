const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

const connectDB = (uri) => {
    // console.log(uri);
    console.log("Database connection start!!");
    return mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useUnifiedTopology: true
        },
        
         console.log("Database connection sucessful!!"));

};


module.exports = connectDB;
// module.exports = connectDB;


