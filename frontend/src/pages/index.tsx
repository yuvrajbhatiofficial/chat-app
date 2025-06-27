import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    console.log("username from localStorage:", savedUsername);
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);
    setUsername(savedUsername);

    socket = io("http://localhost:5001", {
      auth: { token: savedToken },
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", message);
    setMessages((prev) => [...prev, `You: ${message}`]);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    socket.disconnect(); // disconnect socket
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      {/* Top bar */}
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <h1 className="text-2xl font-bold">
        Real-Time Chat - {username || "loading..."}
          </h1>
        <button
          onClick={handleLogout}
          className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
        >
          Logout
        </button>
      </div>

      {/* Chat box */}
      <div className="bg-white w-full max-w-md p-4 rounded shadow">
        <div className="h-64 overflow-y-auto border p-2 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className="mb-1">
              {msg}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
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
        <button
          type="submit"
          
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
        </form>
      </div>
    </div>
  );
}
