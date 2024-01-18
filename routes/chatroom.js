import express from "express";
import ChatRoom from "../models/chatRoom.js";
import Message from "../models/message.js";
const router = express.Router();

// create new chat room
// route -> /chatrooms/new
router.post("/new", async (req, res) => {
    const { sender, receiver } = req.body;

    let chatroom = await ChatRoom.findOne().or([
        { sender, receiver },
        { sender: receiver, receiver: sender },
    ]);

    if (chatroom) return res.status(200).send(chatroom);

    chatroom = new ChatRoom({
        sender,
        receiver,
    });

    await chatroom.save();
    res.status(200).send(chatroom);
});

// get all chat room lists
// route -> /chatrooms/userId -> logged in user id
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const chatrooms = await ChatRoom.find()
            .or([{ sender: userId }, { receiver: userId }])
            .populate({ path: "sender", select: "username profile" })
            .populate({ path: "receiver", select: "username profile" })
            .populate({
                path: "message",
                select: "readBy text createdAt",
                model: Message,
                options: { sort: { createdAt: -1 }, limit: 1 },
            })
            .exec();
        // console.log(chatrooms);
        res.status(200).send(chatrooms);
    } catch (error) {
        res.status(500).send({ error: "Something went wrong." });
    }
});

router.get("/one/:chatId", async (req, res) => {
    const { chatId } = req.params;

    try {
        const chatrooms = await ChatRoom.findOne({ _id: chatId })
            .populate({ path: "sender", select: "username profile" })
            .populate({ path: "receiver", select: "username profile" })
            .populate({
                path: "message",
                select: "readBy text createdAt",
                model: Message,
                options: { sort: { createdAt: -1 }, limit: 1 },
            })
            .exec();
        // console.log(chatrooms);
        res.status(200).send(chatrooms);
    } catch (error) {
        res.status(500).send({ error: "Something went wrong." });
    }
});

export default router;
