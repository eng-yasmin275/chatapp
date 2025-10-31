// app/page.tsx
import dynamic from "next/dynamic";
import React from "react";

// Corrected relative import:
const ChatBox = dynamic(() => import("@/src/components/ChatBox"), { ssr: false });

export default function Page() {
  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">💬 Ably Chat</h1>
        <p className="text-sm text-gray-600 mt-1">
          Realtime chat powered by Ably + MongoDB (persisted).
        </p>
      </div>
      <ChatBox />
    </div>
  );
}
