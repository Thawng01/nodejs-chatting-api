import Message from "../models/message.js";

import express from "express";

const router = express.Router();

router.get("/:chatId", async (req, res) => {
    const { chatId } = req.params;

    const pageNumber = 1;
    const pageSize = 20;
    const skipNumber = (pageNumber - 1) * pageSize;
    try {
        const messages = await Message.find({ chatRoomId: chatId })
            // .sort({ createdAt: "desc" })
            // .skip(skipNumber)
            // .limit(pageSize)
            .exec();
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send({ error: "Something went wrong." });
    }
});

export default router;
