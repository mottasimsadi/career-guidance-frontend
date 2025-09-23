import React from "react";
import {
  MapPin,
  CheckCircle,
  Circle,
  ArrowRight,
  Star,
  Target,
  Trophy,
  BookOpen,
} from "lucide-react";

const SkillMap = ({ skills, userSkills = [], career }) => {
  const getUserSkillStatus = (skill) => {
    return userSkills.some(
      (userSkill) =>
        skill.toLowerCase().includes(userSkill.toLowerCase()) ||
        userSkill.toLowerCase().includes(skill.toLowerCase())
    );
  };

  const getSkillLevel = (index) => {
    if (index < 4)
      return { level: "Foundation", color: "green", icon: BookOpen };
    if (index < 8) return { level: "Core Skills", color: "blue", icon: Target };
    return { level: "Advanced", color: "purple", icon: Trophy };
  };

  const completedSkills = skills.filter((skill) =>
    getUserSkillStatus(skill)
  ).length;
  const overallProgress = Math.round((completedSkills / skills.length) * 100);

  return (
    <div className="skill-map bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-2xl border border-indigo-200 shadow-lg my-4">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-600 p-2 rounded-lg mr-3">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Skill Development Roadmap
          </h3>
          <p className="text-gray-600">
            Your personalized learning path for {career}
          </p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="font-semibold text-indigo-800">
              Overall Progress
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-800">
            {overallProgress}%
          </div>
        </div>
        <div className="bg-white rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-indigo-600 mt-2">
          {completedSkills} of {skills.length} skills mastered
        </p>
      </div>

      {/* Skills Flow - Snake Pattern */}
      <div className="space-y-8">
        <div className="relative">
          {/* Calculate grid dimensions */}
          {(() => {
            const cols = 4; // Fixed 4 columns for snake pattern
            const rows = Math.ceil(skills.length / cols);

            return (
              <div className="space-y-12">
                {" "}
                {/* Increased spacing for arrows */}
                {Array.from({ length: rows }, (_, rowIndex) => {
                  const isEvenRow = rowIndex % 2 === 0;
                  const startIndex = rowIndex * cols;
                  const endIndex = Math.min(startIndex + cols, skills.length);
                  const rowSkills = skills.slice(startIndex, endIndex);

                  // Reverse order for odd rows (0-indexed, so odd visual rows)
                  const displaySkills = !isEvenRow
                    ? [...rowSkills].reverse()
                    : rowSkills;
                  const displayIndices = !isEvenRow
                    ? Array.from(
                        { length: rowSkills.length },
                        (_, i) => endIndex - 1 - i
                      )
                    : Array.from(
                        { length: rowSkills.length },
                        (_, i) => startIndex + i
                      );

                  return (
                    <div key={rowIndex} className="relative">
                      {/* Row of skills */}
                      <div className="grid grid-cols-4 gap-8">
                        {" "}
                        {/* Increased gap */}
                        {displaySkills.map((skill, colIndex) => {
                          const actualIndex = displayIndices[colIndex];
                          const isCompleted = getUserSkillStatus(skill);
                          const skillInfo = getSkillLevel(actualIndex);
                          const IconComponent = skillInfo.icon;

                          const isLastSkill = actualIndex === skills.length - 1;
                          const nextSkillCompleted = !isLastSkill
                            ? getUserSkillStatus(skills[actualIndex + 1])
                            : false;

                          // Arrow direction logic
                          const isLastInRow = !isEvenRow
                            ? colIndex === 0
                            : colIndex === displaySkills.length - 1;
                          const showHorizontalArrow =
                            !isLastInRow && !isLastSkill;
                          const showVerticalArrow =
                            isLastInRow && !isLastSkill && rowIndex < rows - 1;

                          return (
                            <div
                              key={actualIndex}
                              className="relative flex flex-col items-center"
                            >
                              <div
                                className={`relative w-full h-32 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                  isCompleted
                                    ? skillInfo.color === "green"
                                      ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 shadow-lg shadow-green-200"
                                      : skillInfo.color === "blue"
                                      ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-lg shadow-blue-200"
                                      : "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 shadow-lg shadow-purple-200"
                                    : skillInfo.color === "green"
                                    ? "bg-white border-green-300 text-green-700 hover:bg-green-50"
                                    : skillInfo.color === "blue"
                                    ? "bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
                                    : "bg-white border-purple-300 text-purple-700 hover:bg-purple-50"
                                }`}
                              >
                                {/* Level Badge */}
                                <div
                                  className={`absolute -top-2 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                                    skillInfo.color === "green"
                                      ? "bg-green-100 text-green-800"
                                      : skillInfo.color === "blue"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {skillInfo.level}
                                </div>

                                {/* Completion Status */}
                                <div className="absolute -top-2 -right-2">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      isCompleted
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-4 h-full flex flex-col justify-between">
                                  <div className="flex items-start justify-between">
                                    <IconComponent
                                      className={`w-5 h-5 ${
                                        isCompleted
                                          ? "text-white"
                                          : skillInfo.color === "green"
                                          ? "text-green-600"
                                          : skillInfo.color === "blue"
                                          ? "text-blue-600"
                                          : "text-purple-600"
                                      }`}
                                    />
                                    {isCompleted && (
                                      <Star className="w-4 h-4 text-yellow-300" />
                                    )}
                                  </div>

                                  <div>
                                    <h4
                                      className={`font-semibold text-sm mb-1 leading-tight ${
                                        isCompleted
                                          ? "text-white"
                                          : "text-gray-800"
                                      }`}
                                    >
                                      {skill}
                                    </h4>
                                    {isCompleted && (
                                      <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded text-white font-medium">
                                        ✓ Completed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Skill Number */}
                              <div
                                className={`mt-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                                  skillInfo.color === "green"
                                    ? "bg-green-500"
                                    : skillInfo.color === "blue"
                                    ? "bg-blue-500"
                                    : "bg-purple-500"
                                }`}
                              >
                                {actualIndex + 1}
                              </div>

                              {/* Horizontal Arrow - Fixed positioning */}
                              {showHorizontalArrow && (
                                <div
                                  className={`absolute top-16 z-10 ${
                                    !isEvenRow ? "left-0" : "right-0"
                                  } ${
                                    !isEvenRow
                                      ? "-translate-x-6"
                                      : "translate-x-6"
                                  }`}
                                >
                                  <div className="bg-white rounded-full p-2 shadow-md border">
                                    <ArrowRight
                                      className={`w-5 h-5 ${
                                        !isEvenRow ? "transform rotate-180" : ""
                                      } ${
                                        nextSkillCompleted || isCompleted
                                          ? "text-green-500"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Vertical Arrow - Fixed positioning */}
                              {showVerticalArrow && (
                                <div className="absolute top-48 left-1/2 transform -translate-x-1/2 z-10">
                                  <div className="bg-white rounded-full p-2 shadow-md border">
                                    <ArrowRight
                                      className={`w-5 h-5 transform rotate-90 ${
                                        nextSkillCompleted || isCompleted
                                          ? "text-green-500"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Flow Indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-600 bg-white rounded-lg p-3 inline-block shadow-sm border">
            🐍 Follow the snake pattern: Left→Right on first row, then
            Right→Left on second row, and so on...
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">
          Learning Path Legend
        </h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">
              Foundation (Skills 1-4)
            </span>
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">
              Core Skills (Skills 5-8)
            </span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm text-gray-700">Advanced (Skills 9+)</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Follow the numbered sequence and arrows. Complete foundation skills
          before moving to core skills.
        </p>
      </div>
    </div>
  );
};

export default SkillMap;
