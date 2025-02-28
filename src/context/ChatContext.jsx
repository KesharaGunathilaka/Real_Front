import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getMessages } from '../services/chat.service';
import { initializeSocket } from '../utils/socket';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [socket, setSocket] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Initialize socket connection
    useEffect(() => {
        if (currentUser) {
            const newSocket = initializeSocket(currentUser._id);
            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [currentUser]);

    // Set up socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('receiveMessage', (newMessage) => {
            if (
                (activeChat &&
                    ((newMessage.sender === activeChat._id && newMessage.receiver === currentUser._id) ||
                        (newMessage.receiver === activeChat._id && newMessage.sender === currentUser._id)))
            ) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        socket.on('userStatus', (data) => {
            setOnlineUsers(data);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('userStatus');
        };
    }, [socket, activeChat, currentUser]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChat && currentUser) {
            loadMessages(currentUser._id, activeChat._id);
        }
    }, [activeChat, currentUser]);

    const loadMessages = async (senderId, receiverId) => {
        try {
            setLoading(true);
            const data = await getMessages(senderId, receiverId);
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = (content) => {
        if (!socket || !activeChat || !currentUser) return;

        const messageData = {
            sender: currentUser._id,
            receiver: activeChat._id,
            content: content,
            createdAt: new Date().toISOString()
        };

        socket.emit('sendMessage', messageData);
        setMessages((prev) => [...prev, messageData]);
    };

    const value = {
        activeChat,
        setActiveChat,
        messages,
        loading,
        sendMessage,
        users,
        setUsers,
        onlineUsers
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};