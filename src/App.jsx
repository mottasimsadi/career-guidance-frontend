import React from "react";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import Welcome from "./components/Welcome";
import { useChatbot } from "./hooks/useChatbot.jsx";

const App = () => {
  const {
    messages,
    isTyping,
    isLoading,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  } = useChatbot();

  const handleSuggestionClick = (suggestionText) => {
    handleSendMessage(suggestionText);
  };

  return (
    <div className="relative flex flex-col h-screen bg-black text-gray-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {messages.length <= 1 ? (
            <Welcome onSuggestionClick={handleSuggestionClick} />
          ) : (
            <MessageList
              messages={messages}
              isTyping={isTyping}
              isLoading={isLoading}
            />
          )}
        </div>
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={() => handleSendMessage(inputValue)}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default App;