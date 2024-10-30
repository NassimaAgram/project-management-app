import express from "express";
import {
  createChatGroup,
  sendMessage,
  getMessages,
  getUserChatGroups,
  getChatGroupById,
} from "../controllers/chatController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Create a new chat group
router.post("/create-chat", verifyToken, createChatGroup);

// Send a message
router.post("/send-message", verifyToken, sendMessage);

// Fetch messages for a specific chat
router.get("/messages/:chatId", verifyToken, getMessages);

// Get all chat groups for a user
router.get("/user-chats", verifyToken, getUserChatGroups);

// Get a single chat group by ID
router.get("/chat/:chatId", verifyToken, getChatGroupById);

export default router;
