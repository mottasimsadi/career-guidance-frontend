import React, { useRef, useEffect } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import LoadingIndicator from "./LoadingIndicator";

const MessageList = ({ messages, isTyping, isLoading }) => {
  // Receive isLoading
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col">
        {messages.slice(1).map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />} {/* Render based on state */}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
