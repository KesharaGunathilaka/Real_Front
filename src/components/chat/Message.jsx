import { formatDate } from '../../utils/formatDate';

const Message = ({ message, isOwnMessage }) => {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
            >
                <div className="text-sm">{message.content}</div>
                <div
                    className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                        }`}
                >
                    {formatDate(message.createdAt)}
                </div>
            </div>
        </div>
    );
};

export default Message;