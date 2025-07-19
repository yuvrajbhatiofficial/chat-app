import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import UserListSidebar from "@/components/UserListSidebar";
import jwt_decode from "jwt-decode";
import SearchUserList from "@/components/SearchUserList";



let socket: Socket;

interface User {
  id: number;
  username: string;
}
interface DecodedToken {
  id: number;
  username: string;
  email: string;
}


export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messagesMap, setMessagesMap] = useState<{ [userId: number]: string[] }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentMessages = selectedUser ? messagesMap[selectedUser.id] || [] : [];
  const [userId, setUserId] = useState<number | null>(null);
  const CurrentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (!savedToken) {
      router.push("/login");
      return;
      
    }
    
    setToken(savedToken);
    setUsername(savedUsername);
    
    const decoded: any = jwt_decode(savedToken);
    setUserId(decoded.id);
 
    
    
    
    socket = io("http://localhost:5001", {
      auth: { token: savedToken },
    });

    socket.on("receive_message", (data) => {
      const fromId = data.senderId;
      setMessagesMap((prev) => ({
        ...prev,
        [fromId]: [...(prev[fromId] || []), `${data.sender}: ${data.message}`],
      }));
    });
    
    

    return () => {
      socket.disconnect();
    };
  }, []);
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    socket.emit("send_private_message", {
      toUserId: selectedUser.id,
      message,
    });
    if (!selectedUser) return;

      setMessagesMap((prev) => ({
        ...prev,
        [selectedUser.id]: [
          ...(prev[selectedUser.id] || []),
          `You: ${message}`,
        ],
      }));
      setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    socket.disconnect();
    router.push("/login");
  };
//userselect thing
  const handleUserSelect = async (id: number, user: User) => {
    if (!userId) return;
  
    if (!selectedUser || selectedUser.id !== user.id) {
      setSelectedUser(user);
  
      try {
        const res = await fetch(`http://localhost:5001/chat/history/${userId}/${user.id}`);
        const data = await res.json();
  
        const formattedMessages = (data.messages || []).map((msg: any) => {
          return msg.sender_id === userId
            ? `You: ${msg.message}`
            : `${user.username}: ${msg.message}`;
        });
  
        setMessagesMap((prev) => ({
          ...prev,
          [user.id]: formattedMessages,
        }));
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <UserListSidebar
  token={token}
  onUserSelect={handleUserSelect}
/>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-start bg-gray-100 p-4">
        {/* Top bar */}
        <div className="flex justify-between items-center w-full max-w-2xl mb-4">
          <h1 className="text-2xl font-bold">
            {selectedUser
              ? ` ${selectedUser.username}`
              : `Select a user to chat`}
          </h1>
          <button
            onClick={handleLogout}
            className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
          >
            Logout
          </button>
        </div>

        {/* Chat box */}
        <div className="bg-white w-full max-w-2xl p-4 rounded shadow">
          <div className="h-64 overflow-y-auto border p-2 mb-4">
            {currentMessages.map((msg, i) => (
              <div key={i} className={`px-4 py-2 rounded-lg text-sm w-fit m-2 max-w-xs ${
                msg.startsWith("You:")
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {msg} <div className="  text-xs ml-1 text-right m-0.5 ">({time})</div>
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
              placeholder={
                selectedUser ? "Type your message..." : "Select a user first..."
              }
              disabled={!selectedUser}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
              disabled={!selectedUser}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <div>
      <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Search</h1>
      <SearchUserList
          onUserSelect={handleUserSelect}
/>
    </main>
      </div>
    </div>
  );
}
