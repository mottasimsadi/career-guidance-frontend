import React from "react";
import { Bot, BarChart, Trophy, Briefcase } from "lucide-react";

const Welcome = ({ onSuggestionClick }) => {
  const suggestions = [
    { icon: <Briefcase size={20} />, text: "Frontend Developer" },
    { icon: <Trophy size={20} />, text: "Data Scientist" },
    { icon: <BarChart size={20} />, text: "Backend Developer" },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-full text-center px-4">
      <div className="mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
          <Bot className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        Career Guidance AI
      </h1>
      <p className="text-gray-400 mt-2">
        How can I help you navigate your career path today?
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-12 w-full">
        {suggestions.map((item, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(item.text)}
            className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/70 hover:border-purple-500 cursor-pointer transition-all duration-300"
          >
            {item.icon}
            <span className="text-sm text-gray-300">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Welcome;