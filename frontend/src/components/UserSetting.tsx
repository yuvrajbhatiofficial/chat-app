'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {io} from 'socket.io-client'

interface Props {
  collapsed: boolean;
}

export default function UserSetting({ collapsed }: Props) {
  
    if (collapsed) return null;
    const router = useRouter();

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    io().disconnect();
    router.push("/login");
  };
  return (
    <div className="p-4">
      {/* <h2 className="text-xl font-semibold mb-4">Settings</h2> */}
      <div className="space-y-4">
      <button
          onClick={handleLogout}
          className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100 w-full"
        >
          Logout
        </button>
        </div>
    </div>
  );
}
