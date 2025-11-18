import React from 'react';
import { Loader2 } from "lucide-react";

const ChatWindow = ({ messages, isTyping }) => {

  return (
    <div className="max-w-7xl mx-auto w-full p-6 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} fadeIn`}
        >
          {msg.sender === 'agent' && (
            <div className="text-2xl mr-3 mt-2">🤖</div>
          )}
          <div
            className={`max-w-[80%] p-3 rounded-2xl shadow-lg ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300'
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
          {msg.sender === 'user' && (
            <div className="text-2xl ml-3 mt-2">🧑‍💻</div>
          )}
        </div>
      ))}
      {isTyping && (
        <div className="flex items-start justify-start fadeIn">
          <div className="text-2xl mr-3 mt-2">🤖</div>
          <div className="max-w-[80%] p-4 rounded-2xl shadow-lg bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin mr-3" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;