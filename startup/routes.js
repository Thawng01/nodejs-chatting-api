import user from "../routes/user.js";
import auth from "../routes/auth.js";
import chatroom from "../routes/chatroom.js";
import message from "../routes/message.js";

const route = (app) => {
    app.use("/api/users", user);
    app.use("/api/auth", auth);
    app.use("/api/chatrooms", chatroom);
    app.use("/api/messages", message);
};

export default route;
