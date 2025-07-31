'use client';

import { useState } from 'react';
import { FiMessageCircle, FiSearch, FiSettings, FiMenu } from 'react-icons/fi';
import UserListSidebar from './UserListSidebar';
import SearchUserList from './SearchUserList';
import UserSetting from './UserSetting';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Props {
  token: string | null;
  onUserSelect: (chatId: number, user: User) => void;
  onlineUserIds: number[];
}

export default function SideNavbar({ token, onUserSelect, onlineUserIds }: Props) {
  const [activeTab, setActiveTab] = useState<'chats' | 'search' | 'setting'>('chats');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full md:w-auto">
      {/* Vertical Icon Bar */}
      <div
        className={`
          flex md:flex-col 
          md:static fixed bottom-0 left-0 right-0 w-full
          md:w-auto
          items-center justify-around md:items-start md:justify-start
          transition-all duration-300
          bg-white text-black dark:bg-gray-900 dark:text-white
          p-2 md:py-4 space-y-0 md:space-y-4
          z-50
        `}
      >
        {/* Menu Burger */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hidden ${!collapsed && 'md:block'}`}
        >
          <FiMenu size={24} />
        </button>

        {/* Chats */}
        <button
          onClick={() => {
            setActiveTab('chats');
            setCollapsed(false);
          }}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            activeTab === 'chats' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <FiMessageCircle size={24} />
        </button>

        {/* Search */}
        <button
          onClick={() => {
            setActiveTab('search');
            setCollapsed(false);
          }}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            activeTab === 'search' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <FiSearch size={24} />
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            setActiveTab('setting');
            setCollapsed(false);
          }}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            activeTab === 'setting' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <FiSettings size={24} />
        </button>
      </div>

      {/* Right Sidebar */}
      {!collapsed && (
        <div className="md:w-64 w-full bg-white dark:bg-gray-800 dark:text-white shadow flex flex-col">
          {/* Topbar */}
          <div className="p-4 text-xl font-bold bg-white border-r border-b-2 border-gray-100 dark:bg-gray-700 dark:border-gray-600">
            {activeTab === 'chats' && 'Chats'}
            {activeTab === 'search' && 'Search'}
            {activeTab === 'setting' && 'Settings'}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto border-r dark:border-gray-600 border-gray-100">
            {activeTab === 'chats' && (
              <UserListSidebar
                token={token}
                onUserSelect={onUserSelect}
                collapsed={collapsed}
                onlineUserIds={onlineUserIds}
              />
            )}
            {activeTab === 'search' && (
              <SearchUserList onUserSelect={onUserSelect} collapsed={collapsed} />
            )}
            {activeTab === 'setting' && <UserSetting collapsed={collapsed} />}
          </div>
        </div>
      )}
    </div>
  );
}
