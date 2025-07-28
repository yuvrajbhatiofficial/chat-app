import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import UserListSidebar from "@/components/UserListSidebar";
import jwt_decode from "jwt-decode";
import SearchUserList from "@/components/SearchUserList";
import SideNavbar from "@/components/SideNavbar";
import { FiSend } from "react-icons/fi";


let socket: Socket;

interface User {
  id: number;
  username: string;
}
// interface DecodedToken {
//   id: number;
//   username: string;
//   email: string;
// }


export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messagesMap, setMessagesMap] = useState<{ [userId: number]: string[] }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentMessages = selectedUser ? messagesMap[selectedUser.id] || [] : [];
  const [userId, setUserId] = useState<number | null>(null);
  const [scrollToBottom,setScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const CurrentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
// auto scroll feature for chats:----->
const scrollToBottomFn = (smooth = true) => {
  const container = document.getElementById('chat-container');
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',  
    });
  }
};
  
  useEffect(() => {
    if (scrollToBottom) {
      scrollToBottomFn(true); // ✅ smooth scroll
      setScrollToBottom(false);
    }
  }, [currentMessages, scrollToBottom]);
  
// chat history recover----->
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
      setScrollToBottom(true);
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
      setScrollToBottom(true);
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
        setTimeout(() => scrollToBottomFn(false), 0); 
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    }
  };







  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavbar token={token} onUserSelect={handleUserSelect} />
  
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col dark:bg-gray-800 bg-gray-100">
        {/* Top bar */}
        <div className="flex justify-between items-center dark:bg-gray-700 bg-white w-full p-3.5 shadow z-10">
          <h1 className="text-2xl font-bold">
            {selectedUser ? `${selectedUser.username}` : "Select a user to chat"}
          </h1>
        </div>
  
        {/* Chat content area */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex flex-col bg-white dark:bg-slate-700 rounded shadow h-full">
            {/* Scrollable messages */}
            <div
              id="chat-container"
              className="flex-1 overflow-y-auto scroll-smooth p-2 space-y-2"
            >
              {currentMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-lg text-sm w-fit max-w-xs break-words ${
                    msg.startsWith("You:")
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg}
                  <div className="text-[9px] ml-1 opacity-45 text-right mt-1">
                    ({time})
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
  
            {/* Input box fixed at bottom */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 p-2 "
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 dark:bg-gray-600 bg-gray-100 p-2 rounded"
                placeholder={
                  selectedUser ? "Type your message..." : "Select a user first..."
                }
                disabled={!selectedUser}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
                disabled={!selectedUser}
              >
                <FiSend size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
}
