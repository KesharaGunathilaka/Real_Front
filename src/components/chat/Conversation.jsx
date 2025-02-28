import { useRef, useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import Message from './Message';

const Conversation = () => {
    const { activeChat, messages, loading, sendMessage } = useChat();
    const { currentUser } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && activeChat) {
            sendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    if (!activeChat) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-700">Select a user to start chatting</h3>
                    <p className="mt-1 text-sm text-gray-500">Choose from the list on the left</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="flex items-center p-4 border-b bg-white">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-lg uppercase text-white">
                    {activeChat.name.charAt(0)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{activeChat.name}</p>
                    <p className="text-xs text-gray-500">{activeChat.email}</p>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <Message
                                key={message._id || index}
                                message={message}
                                isOwnMessage={message.sender === currentUser._id}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        No messages yet. Start the conversation!
                    </div>
                )}
            </div>

            {/* Message input */}
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Conversation;