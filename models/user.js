import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        profile: String,
        backgroundColor: String,
    },
    { timestamps: true }
);

userSchema.methods.generateUserToken = function () {
    return jwt.sign(
        { _id: this._id, username: this.username, profile: this.profile },
        `${process.env.privateKey}`
    );
};

const User = mongoose.model("User", userSchema);
export default User;
