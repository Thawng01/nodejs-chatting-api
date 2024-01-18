import ChatRoom from "../models/chatRoom.js";
import Message from "../models/message.js";

export const createMessage = async (text, sender, chatId) => {
    try {
        const message = new Message({
            text,
            sender,
            chatRoomId: chatId,
            readBy: sender,
        });

        const chatroom = await ChatRoom.findOne({ _id: chatId }).exec();
        chatroom.message.push(message._id);
        await chatroom.save();
        await message.save();
        return message;
    } catch (error) {
        console.log(error);
    }
};

export const markMessageAsRead = async (id, reader) => {
    try {
        const result = await Message.findByIdAndUpdate(
            id,
            {
                $push: {
                    readBy: reader,
                },
            },
            {
                new: true,
            }
        );
        return result;
    } catch (error) {
        console.log(error);
    }
};
