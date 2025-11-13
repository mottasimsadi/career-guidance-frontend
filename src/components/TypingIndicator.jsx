import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="py-6 bg-gray-800/20">
      <div className="max-w-6xl mx-auto flex px-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mr-4 mt-1">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;