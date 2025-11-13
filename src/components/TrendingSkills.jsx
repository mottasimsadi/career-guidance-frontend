import React from "react";
import { TrendingUp, DollarSign } from "lucide-react";

const TrendingSkills = ({ data, career }) => {
  if (!data) return null;

  return (
    <div className="my-4 p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
      <h4 className="text-lg font-bold text-gray-200 mb-4">
        Live Job Market Insights:{" "}
        <span className="text-purple-400">{career}</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trending Skills */}
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
            <h5 className="font-semibold text-gray-300">Trending Skills</h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.trending_skills.map((skill) => (
              <span
                key={skill}
                className="bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="flex items-center mb-3">
            <DollarSign className="w-5 h-5 text-green-400 mr-2" />
            <h5 className="font-semibold text-gray-300">
              Estimated Salary Range
            </h5>
          </div>
          <p className="text-xl font-bold text-green-400">
            {data.salary_range}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        *Based on real-time analysis of recent USA job postings.
      </p>
    </div>
  );
};

export default TrendingSkills;