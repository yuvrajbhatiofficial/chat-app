import { useEffect, useState } from "react";

interface Props {
  token: string | null; // The user's auth token
  onUserSelect: (chatId: number, user: any) => void; // Callback to notify parent when a user is selected
  collapsed: boolean;
}

export default function UserListSidebar({ token, onUserSelect, collapsed }: Props) {
  if (collapsed) return null;
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]); // List of users with active chats

  useEffect(() => {
    if (!token) return;

    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5001/users", {
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
      collapsed ? 'hidden' : 'w-64'
    }  h-full overflow-y-auto bg-white dark:bg-gray-800 dark:text-white shadow`}
  >

      {/* <h2 className="text-xl font-semibold p-4  border-t-2 border-gray-100 ">Users</h2> */}
      <ul>
        {connectedUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => onUserSelect(user.id, user)}
            className="cursor-pointer text-xl hover:bg-gray-100 hover:text-black px-4 py-4 border-b border-gray-200 dark:border-gray-900"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
