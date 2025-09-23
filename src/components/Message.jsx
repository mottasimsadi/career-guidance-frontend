import React from "react";
import { User, Bot } from "lucide-react";

const Message = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-xl lg:max-w-5xl ${
          message.type === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            message.type === "user" ? "bg-indigo-600 ml-3" : "bg-gray-700 mr-3"
          }`}
        >
          {message.type === "user" ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        <div
          className={`px-6 py-4 rounded-2xl ${
            message.type === "user"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-800 shadow-md border border-gray-100"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.component && <div className="mt-3">{message.component}</div>}
          <div
            className={`text-xs mt-2 ${
              message.type === "user" ? "text-indigo-200" : "text-gray-500"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;