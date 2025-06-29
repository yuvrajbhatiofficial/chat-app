import { useEffect, useState } from "react";

interface Props {
  token: string | null; // The user's auth token
  onUserSelect: (chatId: number, user: any) => void; // Callback to notify parent when a user is selected
}

export default function UserListSidebar({ token, onUserSelect }: Props) {
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
    <div className="w-64 border-r h-full overflow-y-auto bg-white shadow">
      <h2 className="text-xl font-semibold p-4 border-b">Users</h2>
      <ul>
        {connectedUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => onUserSelect(user.id, user)}
            className="cursor-pointer hover:bg-gray-100 px-4 py-2 border-b"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
