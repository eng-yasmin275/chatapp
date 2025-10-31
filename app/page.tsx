'use client';
import { useEffect, useState } from 'react';
import Ably from 'ably';

export default function HomePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    const channel = ably.channels.get('test-channel');

    channel.subscribe('greeting', (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    });

    // send a test message once connected
    channel.publish('greeting', 'Hello from Next.js + Ably!');

    setClient(ably);

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Ably Test Chat</h1>
      <ul className="border rounded p-4 w-80">
        {messages.map((m, i) => (
          <li key={i} className="border-b py-1">{m}</li>
        ))}
      </ul>
    </main>
  );
}


