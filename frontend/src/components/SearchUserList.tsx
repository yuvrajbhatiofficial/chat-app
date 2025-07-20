'use client';
import { useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Props {
  onUserSelect: (chatId: number, user: any) => void;
}

export default function SearchUserList({ onUserSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/users/search?q=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    // Same logic as UserListSidebar
    onUserSelect(user.id, user);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search by email or username"
          className="border p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <ul>
        {results.map((user) => (
          <li
            key={user.id}
            className="border-b py-2 cursor-pointer hover:text-black hover:bg-gray-100"
            onClick={() => handleUserClick(user)}
          >
            <strong>{user.username}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
