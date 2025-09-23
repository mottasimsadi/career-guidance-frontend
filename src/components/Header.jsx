import React from "react";
import { Bot } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <div className="bg-indigo-600 p-2 rounded-lg mr-3">
            <Bot className="w-6 h-6 text-white" />
          </div>
          Career Skills Roadmap Assistant
        </h1>
        <p className="text-gray-600 mt-1">
          Get personalized skill recommendations and visual learning paths
        </p>
      </div>
    </div>
  );
};

export default Header;