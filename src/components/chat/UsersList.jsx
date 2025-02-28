import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const UsersList = ({ users, loading }) => {
    const { activeChat, setActiveChat, onlineUsers } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (users) {
            setFilteredUsers(
                users.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [users, searchTerm]);

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Users
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <li
                                    key={user._id}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center ${activeChat && activeChat._id === user._id ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => setActiveChat(user)}
                                >
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-lg uppercase text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        {isUserOnline(user._id) && (
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-center text-gray-500">No users found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UsersList;