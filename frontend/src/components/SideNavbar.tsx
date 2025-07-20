'use client';

import { useState } from 'react';
import { FiMessageCircle, FiSearch, FiSettings } from 'react-icons/fi';
import UserListSidebar from './UserListSidebar';
import SearchUserList from './SearchUserList';
import UserSetting from './UserSetting';

interface Props {
  token: string | null;
  onUserSelect: (chatId: number, user: any) => void;
}

export default function SideNavbar({ token, onUserSelect }: Props) {
  const [activeTab, setActiveTab] = useState<'chats' | 'search' | 'setting'>('chats');

  return (
    <div className="flex h-screen">
      {/* Vertical Icon Bar */}
      <div className="w-16 bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col items-center py-4 space-y-4">
       {/* chats */}
        <button
          onClick={() => setActiveTab('chats')}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            activeTab === 'chats' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <FiMessageCircle size={24} />
        </button>
        {/* serach  */}
        <button
          onClick={() => setActiveTab('search')}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            activeTab === 'search' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <FiSearch size={24} />
        </button>
        {/* setting */}
        <button
          onClick={() => setActiveTab('setting')}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            activeTab === 'setting' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <FiSettings size={24} />
        </button>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 border-r bg-white dark:bg-gray-800 dark:text-white shadow flex flex-col">
        {/* Topbar */}
        <div className="p-4 border-b text-xl font-bold bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
          {activeTab === 'chats' && 'Chats'}
          {activeTab === 'search' && 'Search'}
          {activeTab === 'setting' && 'Settings'}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' && (
            <UserListSidebar token={token} onUserSelect={onUserSelect} />
          )}
          {activeTab === 'search' && (
            <SearchUserList onUserSelect={onUserSelect} />
          )}
          {activeTab === 'setting' && (<UserSetting/>)}
        </div>
      </div>
    </div>
  );
}
