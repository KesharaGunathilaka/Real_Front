import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChatProvider } from '../../context/ChatContext';
import UsersList from './UsersList';
import Conversation from './Conversation';
import axios from 'axios';

const ChatContainer = () => {
    const { currentUser, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                setLoading(true);
                // Get all users except current user
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const filteredUsers = response.data.filter(user => user._id !== currentUser._id);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentUser) {
        return null;
    }

    return (
        <ChatProvider>
            <div className="flex h-screen bg-gray-100">
                <div className="flex flex-col w-full h-full">
                    {/* Header */}
                    <div className="bg-white shadow-sm z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16 items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <h1 className="text-xl font-bold text-gray-900">Chat App</h1>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-4">Hi, {currentUser.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Users list sidebar */}
                        <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
                            <UsersList users={users} loading={loading} />
                        </div>

                        {/* Chat area */}
                        <div className="w-3/4 flex flex-col">
                            <Conversation />
                        </div>
                    </div>
                </div>
            </div>
        </ChatProvider>
    );
};

export default ChatContainer;