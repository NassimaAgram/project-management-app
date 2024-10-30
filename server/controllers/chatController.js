import Chat from "../models/Chat.js";
import Message from "../models/Messages.js";

// Create a new chat group
export const createChatGroup = async (req, res) => {
  const { projectId, users, isGroup, chatName } = req.body;
  try {
    const chatGroup = new Chat({
      projectId,
      users,
      isGroup,
      chatName,
    });
    await chatGroup.save();
    res.status(201).json(chatGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId, sender, content } = req.body;
  try {
    const message = new Message({ chatId, sender, content });
    await message.save();

    // Update latest message in Chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch messages for a specific chat
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId }).populate("sender", "name img");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all chat groups for a user
export const getUserChatGroups = async (req, res) => {
  const userId = req.user._id;
  try {
    const chatGroups = await Chat.find({ users: userId }).populate("latestMessage");
    res.status(200).json(chatGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single chat group by ID
export const getChatGroupById = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chatGroup = await Chat.findById(chatId).populate("users", "name img");
    res.status(200).json(chatGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
