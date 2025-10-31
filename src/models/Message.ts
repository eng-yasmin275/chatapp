import mongoose, { Schema, models } from "mongoose";

const messageSchema = new Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const Message = models.Message || mongoose.model("Message", messageSchema);
export default Message;
