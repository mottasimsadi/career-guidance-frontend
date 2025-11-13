import React from "react";
import { User, Bot } from "lucide-react";

const Message = ({ message }) => {
  const isUser = message.type === "user";

  return (
    <div
      className={`py-6 border-b border-gray-800 ${
        isUser ? "" : "bg-gray-800/20"
      }`}
    >
      <div className="max-w-6xl mx-auto flex px-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 ${
            isUser
              ? "bg-purple-600"
              : "bg-gradient-to-br from-purple-600 to-blue-500"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-grow">
          <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
            {message.content}
          </div>
          {message.component && <div className="mt-4">{message.component}</div>}
        </div>
      </div>
    </div>
  );
};

export default Message;