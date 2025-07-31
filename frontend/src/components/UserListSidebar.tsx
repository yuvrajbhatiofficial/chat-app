import { useEffect, useState } from "react";

interface Props {
  token: string | null; // The user's auth token
  onUserSelect: (chatId: number, user: any) => void; // Callback to notify parent when a user is selected
  collapsed: boolean;
  onlineUserIds: number[];
}

export default function UserListSidebar({ token, onUserSelect, collapsed ,onlineUserIds}: Props) {
  if (collapsed) return null;
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]); // List of users with active chats

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL not set in environment variables.");
  }


  useEffect(() => {
    if (!token) return;

    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}l/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setConnectedUsers(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [token]);
  

  return (
    <div
    className={`transition-all duration-300 ${
      collapsed ? 'hidden' : 'md:w-64 w-full'
    }  h-full overflow-y-auto bg-white dark:bg-gray-800 dark:text-white shadow`}
  >

      {/* <h2 className="text-xl font-semibold p-4  border-t-2 border-gray-100 ">Users</h2> */}
      <ul>
        {connectedUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => onUserSelect(user.id, user)}
            className=" cursor-pointer text-lg md:text-xl hover:bg-gray-100 hover:text-black px-4 py-4 border-b border-gray-200 dark:border-gray-900"
          >
            <span>{user.username}</span>
      {onlineUserIds.includes(user.id) && (
        <span className="text-green-500 text-xs ml-2">●</span>
      )}
          </li>
        ))}
      </ul>
    </div>
  );
}
