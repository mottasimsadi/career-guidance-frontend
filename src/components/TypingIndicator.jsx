import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-xs lg:max-w-2xl">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 mr-3 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-md border border-gray-100">
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