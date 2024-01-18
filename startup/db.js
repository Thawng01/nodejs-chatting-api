import mongoose from "mongoose";

const db = () =>
    mongoose
        .connect(`${process.env.DB_URL}`)
        .then(() => console.log("Connected to mongodb."))
        .catch((error) => console.log(error));

export default db;
