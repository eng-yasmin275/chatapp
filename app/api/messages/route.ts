// src/app/api/messages/route.ts
import { NextResponse } from "next/server";
import mongoose, { Schema, model, models } from "mongoose";
import connectMongo from "@/src/lib/mongodb";

// Define schema
const messageSchema = new Schema({
  user: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = models.Message || model("Message", messageSchema);

// GET → get all messages
export async function GET() {
  try {
    await connectMongo();
    const messages = await Message.find().sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (err: any) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

// POST → save a new message
export async function POST(req: Request) {
  try {
    await connectMongo();
    const { user, text } = await req.json();
    const message = await Message.create({ user, text });
    return NextResponse.json(message);
  } catch (err: any) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
