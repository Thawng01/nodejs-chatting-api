import { createMessage, markMessageAsRead } from "./utils/message.js";

const socket = (io) => {
    let users = [];
    io.on("connection", (socket) => {
        // console.log("connected...");
        // add user
        socket.on("userAdded", (user) => {
            // console.log(user);
            const existed = users.find((u) => u._id === user._id);
            if (!existed) {
                users.push({
                    _id: user._id,
                    username: user.username,
                    socketId: socket.id,
                    profile: user.profile,
                });
            }

            io.emit("activeUsers", users);
        });

        // disconnect user
        socket.on("logout", (user) => {
            const updatedUser = users.filter((u) => u._id !== user._id);
            users = updatedUser;
            io.emit("activeUsers", users);
        });

        socket.on("disconnect", () => {
            const updatedUser = users.filter((u) => u.socketId !== socket.id);
            users = updatedUser;
            io.emit("activeUsers", users);
        });

        socket.on("newChatList", (data) => {
            io.emit("chatlist", data);
        });

        // user typing
        socket.on("user-typing", (userId) => {
            console.log("typing : ", userId);
            io.emit("typing", userId);
        });

        // user stop typing
        socket.on("stop-typing", (userId) => {
            console.log("stop : ", userId);
            io.emit("stopTyping", userId);
        });

        // messages
        socket.on("newMessage", async (data) => {
            // console.log(data);
            const { sender, text, chatId, profile, username, receiverId } =
                data;
            const message = await createMessage(text, sender, chatId);
            const newMessage = {
                _id: message._id,
                profile,
                username,
                sender,
                text: message.text,
                updatedAt: message.updatedAt,
                createdAt: message.createdAt,
                chatRoomId: message.chatRoomId,
                readBy: message.readBy,
                receiver: receiverId,
            };
            io.emit("message", newMessage);
            io.emit("chatListMessage", newMessage);
        });

        // mark message as read
        socket.on("mark-as-read", async (data) => {
            const { messageId, reader } = data;
            const newMessage = await markMessageAsRead(messageId, reader);
            io.emit("read", newMessage);
        });
    });
};

export default socket;
