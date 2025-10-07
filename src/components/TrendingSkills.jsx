import React from "react";
import { TrendingUp, DollarSign } from "lucide-react";

// This component now receives the final data as a prop.
// It no longer has its own loading or error states.
const TrendingSkills = ({ data, career }) => {
  if (!data) {
    return null; // Don't render if there's no data
  }

  return (
    <div className="my-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-md">
      <h4 className="text-lg font-bold text-gray-800 mb-4">
        Live Job Market Insights for a {career}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
            <h5 className="font-semibold text-indigo-800">Trending Skills</h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.trending_skills.map((skill) => (
              <span
                key={skill}
                className="bg-indigo-200 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            <h5 className="font-semibold text-green-800">
              Estimated Salary Range
            </h5>
          </div>
          <p className="text-xl font-bold text-green-700">
            {data.salary_range}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        *Based on real-time analysis of recent job postings.
      </p>
    </div>
  );
};

export default TrendingSkills;