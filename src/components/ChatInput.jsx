import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyPress,
}) => {
  return (
    <div className="p-4 w-full">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center bg-gray-900 border border-gray-700 rounded-2xl p-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about a career path, required skills, or salary..."
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none resize-none px-3 py-2"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;