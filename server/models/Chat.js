import mongoose from "mongoose";

const ChatGroupSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projects",
    required: false,
    unique: true,
  },
  photo: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9790/9790561.png",
  },
  chatName: {
    type: String,
    default: "", 
  },
  isGroup: {
    type: Boolean,
    default: true, // Default to true, as this is for group chats related to projects
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

// Pre-save hook to set the chat name based on the project name
ChatGroupSchema.pre("save", async function (next) {
  if (!this.chatName && this.projectId) {
    try {
      const project = await Project.findById(this.projectId).select("title"); // Assumes project has a title field
      if (project) {
        this.chatName = `${project.title} chat`;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model("Chat", ChatGroupSchema);
