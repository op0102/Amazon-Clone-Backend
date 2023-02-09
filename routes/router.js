const express = require("express");
const router = express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const Authenticate = require("../middleware/Authenticate");





router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find();
        res.status(201).json(productsdata);

    } catch (error) {
        console.log(`error in router ${error}`);

    }
})

//get individual data
router.get('/getproductsone/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const individualdata = await Products.findOne({ id: id });
        res.status(201).json(individualdata);
        console.log(`getproductsone request success !!`);

    } catch (error) {
        res.status(404).json(error.message)
        console.log(`Errorn in individualGet Data ${error.message}`);


    }
});

//register user
router.post("/register", async (req, res) => {
    const { fname, email, password, cpassword, number } = req.body;

    if (!fname || !email || !password || !cpassword || !number) {
        res.status(422).json({ error: "fill the data!!" })
        console.log("No data available!!");
    }
    try {
        const preuserEmail = await USER.findOne({ email: email });
        const preuserMobile = await USER.findOne({ number: number });
        if (preuserEmail) {
            res.status(422).json({ error: "this email already used!!" })
            console.log("this email already used!!");
        } else if (preuserMobile) {
            res.status(422).json({ error: "this number already used!!" })
            console.log("this number already used !!");
        } else if (password !== cpassword) {
            res.status(422).json({ error: "retype password not match!!" })
            console.log("retype password not match!!");

        } else {
            const finalUser = new USER({
                fname, email, password, cpassword, number
            })
            const storedata = await finalUser.save();
            console.log(storedata);
            res.status(201).json(storedata);
            console.log("data stored successfully!!");
        }


    } catch (error) {
        console.log(error);

    }

})

// login user api
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "fill the data!" })
    }
    try {
        const userlogin = await USER.findOne({ email: email });
        console.log(userlogin);

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);

            // token generate
            const token = await userlogin.generateAuthtoken();
            console.log(token);

            //generate cookie
            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            })

            if (!isMatch) {
                res.status(400).json({ error: "password incorrect!" })
            } else {


                res.status(200).json(userlogin);


            }
        } else {
            res.status(400).json({ error: "invalid details!" })
        }

    } catch (error) {
        res.status(400).json({ error: "invalid details!" })

    }


})


// add item to cart
router.post("/addcart/:id", Authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart);

        const userContact = await USER.findOne({ _id: req.userID });

        if (userContact) {
            const cartData = await userContact.addcartdata(cart);
            await userContact.save();
            console.log(cartData);
            res.status(201).json(userContact);
        } else {
            res.status(401).json("invalid user!");
        }
    } catch (error) {
        res.status(401).json("invalid user!");

    }
});


//get cart details
router.get("/cartdetails", Authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error);
    }
})


//get valid user
router.get("/validuser", Authenticate, async (req, res) => {
    try {
        const validUserOne = await USER.findOne({ _id: req.userID });
        res.status(201).json(validUserOne);
    } catch (error) {
        console.log(error);
    }
})


//remove produt from cart
router.delete("/remove/:id", Authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((currentValue) => {
            return currentValue.id != id;
        })

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("product removed!");
    } catch (error) {
        console.log(error);
        res.status(400).json(req.rootUser);
    }
})


// logout userCredential
router.get("/logout", Authenticate, (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curElem) => {
            return curElem.token !== req.token
        })

        res.clearCookie("Amazonweb",{path:"/"});

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("User Logout");
         


    } catch (error) {
        console.log(error);

    }

});












module.exports = router;
