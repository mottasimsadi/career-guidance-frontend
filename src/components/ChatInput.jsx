import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyPress,
}) => {
  return (
    <div className="bg-white border-t shadow-lg p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: "52px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors duration-200 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;