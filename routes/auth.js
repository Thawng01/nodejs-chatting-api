import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

// login
// route -> /auth
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user already registered or not
        let user = await User.findOne({ email }).exec();
        if (!user)
            return res
                .status(404)
                .send({ error: "No user with the given Email." });

        // check if password is valid or not
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return res.status(400).send({ error: "password incorrect." });

        // generate token and send it to client
        const token = user.generateUserToken();
        res.status(200).send({ token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Something went wrong." });
    }
});

export default router;
