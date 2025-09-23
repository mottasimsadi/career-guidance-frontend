import React from "react";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { useChatbot } from "./hooks/useChatbot.jsx"; // Updated import

const App = () => {
  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  } = useChatbot();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default App;