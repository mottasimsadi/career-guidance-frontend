import React from "react";
import { Loader2 } from "lucide-react";

const LoadingIndicator = ({ message = "Fetching real-time job data..." }) => {
  return (
    <div className="py-6 bg-gray-800/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin mr-3" />
          <span className="text-gray-300">{message}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This may take up to a minute...
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;