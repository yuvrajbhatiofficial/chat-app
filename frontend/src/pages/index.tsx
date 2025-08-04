import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
// import UserListSidebar from "@/components/UserListSidebar";
import jwt_decode from "jwt-decode";
// import SearchUserList from "@/components/SearchUserList";
import SideNavbar from "@/components/SideNavbar";
import { FiSend, FiChevronLeft } from "react-icons/fi";





interface User {
  id: number;
  username: string;
}
interface DecodedToken {
  id: number;
  username: string;
  email: string;
}
interface ChatMessage {
  sender_id: number;
  message: string;
}
interface IncomingSocketMessage {
  senderId: number;
  sender: string;
  message: string;
} 


export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messagesMap, setMessagesMap] = useState<{ [userId: number]: string[] }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentMessages = useMemo(() => {
    return selectedUser ? messagesMap[selectedUser.id] || [] : [];
  }, [selectedUser, messagesMap]);
  const [userId, setUserId] = useState<number | null>(null);
  const [scrollToBottom,setScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
  // const CurrentTime = new Date().toLocaleTimeString([], {
  //   hour: '2-digit',
  //   minute: '2-digit',
  // });
  const socketRef = useRef<Socket | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL not set in environment variables.");
  }
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
    
    
    try {
      const decoded = jwt_decode<DecodedToken>(savedToken);
      setUserId(decoded.id);
    } catch  {
      console.error("Invalid token");
      router.push("/login");
      return;
    }
    
    
    
    socketRef.current = io(apiUrl, {
      auth: { token: savedToken },
    });

    socketRef.current.on("receive_message", (data: IncomingSocketMessage) => {
      const fromId = data.senderId;
      setMessagesMap((prev) => ({
        ...prev,
        [fromId]: [...(prev[fromId] || []), `${data.sender}: ${data.message}`],
      }));
      setScrollToBottom(true);
    });
    
    

    return () => {
      socketRef.current?.disconnect();
    };
  }, [apiUrl, router]);
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const sendMessage = () => {
    if  (!socketRef.current || !selectedUser || !message.trim()) return;
    socketRef.current.emit("send_private_message", {
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
        const res = await fetch(`${apiUrl}/chat/history/${userId}/${user.id}`);
        const data = await res.json();
  
        const formattedMessages = (data.messages as ChatMessage[] || []).map((msg) => {
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

  // online status indicator

  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
  
    socketRef.current.on("online_users", (userIds: number[]) => {
      console.log("🔄 Online users updated:", userIds);
      setOnlineUserIds(userIds);
    });
  
    return () => {
      socket.off("online_users");
    };
  }, [token]);





  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`md:flex ${
          selectedUser ? "hidden" : "flex"
        } w-full md:w-auto`}
      >
        <SideNavbar
          token={token}
          onUserSelect={handleUserSelect}
          onlineUserIds={onlineUserIds}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${
          !selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center dark:bg-gray-700 bg-white w-full p-3.5 border-b dark:border-gray-600 border-gray-100 z-10">
          <div className="flex items-center gap-2">
            {/* backed icon  */}
            {selectedUser && (
              <button
                className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setSelectedUser(null)}
              >
                <FiChevronLeft size={30} />
              </button>
            )}

            {selectedUser ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {selectedUser.username}
                </span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    onlineUserIds.includes(selectedUser.id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                  title={
                    onlineUserIds.includes(selectedUser.id)
                      ? "Online"
                      : "Offline"
                  }
                ></span>
              </div>
            ) : (
              <h1 className="text-2xl font-bold">Select a user to chat</h1>
            )}
            {/* for eslint error empty use of username */}
            <span className="hidden">{username}</span>
          </div>
        </div>

        {/* Chat content area */}
        <div className="flex-1 flex flex-col p-4  overflow-hidden">
          <div className="flex flex-col h-full rounded-2xl  backdrop-blur-md">
            {/* Scrollable messages */}
            <div
              id="chat-container"
              className="flex-1 overflow-y-auto scroll-smooth p-2 space-y-2"
            >
              {currentMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-xl text-base w-fit max-w-xs break-words backdrop-blur-sm ${
                    msg.startsWith("You:")
                      ? "bg-blue-500/80 text-white ml-auto  border    dark:bg-white/10 dark:border dark:border-white/30 "
                      : "bg-gray-200/50 text-gray-900     border border-white  dark:text-white   dark:bg-slate-500/20 dark:border dark:border-white/10"
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
                className="flex-1 dark:bg-gray-600 dark:border-0 border-gray-200 border-1  bg-gray-100 p-2 rounded"
                placeholder={
                  selectedUser
                    ? "Type your message..."
                    : "Select a user first..."
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