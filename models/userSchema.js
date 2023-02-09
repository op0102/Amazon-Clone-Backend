const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const secretKey = process.env.secretKey;


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not valid email address !!")

            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6
    },
    number: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },

    tokens: [{ token: [{ type: String, required: true }] }],

    carts: []
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }

    next();
}
);

// userToken generate process
userSchema.methods.generateAuthtoken = async function () {
    try {
        let token = JWT.sign({ _id: this._id }, secretKey);
        console.log(`generateAuthtoken token ${token}`);
        this.tokens = this.tokens.concat({ token: token });
        console.log(`tokens userSchema ${this.tokens}`);
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }

}

//add to cart item 
userSchema.methods.addcartdata = async function(cart){
    try {
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error);
    }

}





const USER = mongoose.model('USER', userSchema);

module.exports = USER;






