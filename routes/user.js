import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import cloudinary from "../utils/cloudinary.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// register new user
// route -> /users/new
router.post("/new", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email }).exec();
        if (user)
            return res
                .status(400)
                .send({ error: "Email already used by another user." });

        user = new User({
            username,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const token = user.generateUserToken();
        await user.save();
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send("Something went wrong.");
    }
});

// get a user info
// route -> /users/userid
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).exec();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." });
    }
});

// update user name
// route -> /users/username/id
router.put("/username/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    username: req.body.username,
                },
            },
            { new: true }
        );
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: "Something went wrong." });
    }
});

// update user profile
// route -> /users/profile
router.put("/profile/:id", upload.single("profile"), async (req, res) => {
    const { id } = req.params;

    try {
        cloudinary.v2.uploader.upload(req.file.path, async (error, result) => {
            if (error !== undefined) {
                console.log(error);
                return res.status(400).send("Something went wrong.");
            }

            const user = await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        profile: result.secure_url,
                    },
                },
                { new: true }
            );

            res.status(200).send(user);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong.");
    }
});

export default router;
