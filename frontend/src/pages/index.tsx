import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", message);
    setMessages((prev) => [...prev, `You: ${message}`]);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>
      <div className="bg-white w-full max-w-md p-4 rounded shadow">
        <div className="h-64 overflow-y-auto border p-2 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className="mb-1">{msg}</div>
          ))}
        </div>
        <form 
        onSubmit={(e) =>{
          e.preventDefault(); //prevent page relode
          sendMessage();
        }}
        >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border w-full p-2 mb-2"
          placeholder="Type your message..."
        />
        </form>
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
