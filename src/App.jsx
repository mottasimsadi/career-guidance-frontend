import React, { useRef, useEffect } from "react"; // Import useRef and useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Skills from "./components/Skills";
import LearningPlan from "./components/LearningPlan";
import LoadingIndicator from "./components/LoadingIndicator";
import { useChatbot } from "./hooks/useChatbot.jsx";
import Header from "./components/Header.jsx";

const ChatApp = () => {
  const {
    messages,
    isTyping,
    isLoading,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  } = useChatbot();

  // The ref for the scrollable container
  const scrollRef = useRef(null);

  // The auto-scrolling logic
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isTyping, isLoading]); // Also trigger on isLoading change

  return (
    <div className="relative flex flex-col h-screen bg-black text-gray-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <ChatWindow messages={messages} isTyping={isTyping} />
        </div>

        {isLoading && <LoadingIndicator />}

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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/learning-plan" element={<LearningPlan />} />
      </Routes>
    </Router>
  );
};

export default App;