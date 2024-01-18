import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

import socket from "./socket.js";
import route from "./startup/routes.js";
import db from "./startup/db.js";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const url = "https://nextjs-chatting.vercel.app/";
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

socket(io);
db();
route(app);

const port = process.env.PORT || 9000;
httpServer.listen(port, () => console.log(`listening to port: ${port}`));
