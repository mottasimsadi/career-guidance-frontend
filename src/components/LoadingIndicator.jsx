import React from "react";
import { Loader2 } from "lucide-react";

const LoadingIndicator = ({ message = "Analyzing job market data..." }) => {
  return (
    <div className="my-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-md">
      <div className="flex items-center justify-center space-x-3">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="text-gray-700 font-medium">{message}</span>
      </div>
      <div className="mt-4 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        This may take up to a minute depending on data availability
      </p>
    </div>
  );
};

export default LoadingIndicator;