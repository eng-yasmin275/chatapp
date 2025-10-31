"use client";

import { useEffect, useState, useRef } from "react";
import Ably, { RealtimeChannel } from "ably";

export default function ChatPage() {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [messages, setMessages] = useState<
    { user: string; text: string; type?: string; time?: string }[]
  >([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Connect to Ably
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing Ably API key!");
      return;
    }

    const ably = new Ably.Realtime({ key: apiKey });
    const chatChannel = ably.channels.get("amana-chat");

    chatChannel.subscribe("message", (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    });

    setClient(ably);
    setChannel(chatChannel);

    return () => {
      chatChannel.unsubscribe();
      ably.close();
    };
  }, []);

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send chat message
  const sendMessage = async () => {
    if (!channel || !text.trim()) return;

    const newMsg = {
      user,
      text,
      type: "chat",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    channel.publish("message", newMsg);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });

    setText("");
  };

  // ✅ Handle joining
  const handleJoin = async () => {
    if (user.trim().length < 2) {
      alert("Please enter your full name (at least 2 characters)");
      return;
    }

    setJoined(true);

    const joinMsg = {
      user,
      text: `${user} joined the chat 💫`,
      type: "system",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    channel?.publish("message", joinMsg);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(joinMsg),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-blue-600 text-white py-4 px-6 text-center text-2xl font-bold">
          💬 Amana Chat Room
        </div>

        {!joined ? (
          <div className="p-6 flex flex-col items-center">
            <input
              className="border border-gray-300 p-3 rounded w-72 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter your full name"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <button
              onClick={handleJoin}
              className="mt-4 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <div className="flex flex-col p-4 h-[600px]">
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-2">
              {messages.map((m, i) => (
                <div key={i}>
                  {m.type === "system" ? (
                    <div className="text-center text-gray-500 italic text-sm">
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className={`flex ${
                        m.user === user ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl max-w-[70%] ${
                          m.user === user
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="text-sm font-semibold">{m.user}</div>
                        <div>{m.text}</div>
                        <div className="text-xs text-gray-300 mt-1">
                          {m.time || ""}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-3 flex">
              <input
                className="border flex-grow p-3 rounded-l-lg outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
