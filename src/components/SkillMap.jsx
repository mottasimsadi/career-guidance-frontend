import React from "react";
import {
  MapPin,
  CheckCircle,
  Circle,
  Target,
  Trophy,
  BookOpen,
  Play,
} from "lucide-react";

const SkillMap = ({ skills, userSkills = [], career }) => {
  const getUserSkillStatus = (skill) =>
    userSkills.some(
      (userSkill) =>
        skill.toLowerCase().includes(userSkill.toLowerCase()) ||
        userSkill.toLowerCase().includes(skill.toLowerCase())
    );

  const getSkillLevel = (index) => {
    if (index < 4)
      return { level: "Foundation", color: "blue", icon: BookOpen };
    if (index < 8) return { level: "Core", color: "purple", icon: Target };
    return { level: "Advanced", color: "green", icon: Trophy };
  };

  const completedSkills = skills.filter(getUserSkillStatus).length;
  const overallProgress =
    skills.length > 0 ? Math.round((completedSkills / skills.length) * 100) : 0;

  const colorClasses = {
    blue: { text: "text-blue-300", border: "border-blue-500" },
    purple: { text: "text-purple-300", border: "border-purple-500" },
    green: { text: "text-green-300", border: "border-green-500" },
  };

  const getSnakeNumber = (index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return row % 2 === 0 ? index + 1 : (row + 1) * 4 - col;
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 my-4">
      <div className="flex items-center mb-6">
        <div className="bg-purple-600 p-2 rounded-lg mr-3">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-200">
            Skill Development Roadmap
          </h3>
          <p className="text-gray-400">
            Your path for{" "}
            <span className="text-purple-400 font-semibold">{career}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-purple-400 mr-2" />
            <span className="font-semibold text-gray-300">
              Overall Progress
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-200">
            {overallProgress}%
          </div>
        </div>
        <div className="bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {completedSkills} of {skills.length} skills mastered
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-16 pb-12">
        {skills.map((skill, index) => {
          const isCompleted = getUserSkillStatus(skill);
          const levelInfo = getSkillLevel(index);
          const colors = colorClasses[levelInfo.color];
          const Icon = levelInfo.icon;

          const row = Math.floor(index / 4);
          const isEvenRow = row % 2 === 0;
          const isLastInRow = (index + 1) % 4 === 0;
          const isFirstInRow = index % 4 === 0;
          const isLastSkill = index === skills.length - 1;

          const connectorColor = "border-purple-600";
          const arrowColor = "text-purple-600";

          return (
            <div key={index} className="relative">
              {/* HORIZONTAL CONNECTOR (L to R on even rows) */}
              {isEvenRow && !isLastInRow && !isLastSkill && (
                <div
                  className={`absolute top-1/2 left-full w-8 h-px -translate-y-1/2 border-t-2 border-dashed ${connectorColor} z-[-1]`}
                >
                  <div
                    className={`absolute top-1/2 right-[-10px] -translate-y-1/2 ${arrowColor}`}
                  >
                    <Play fill="currentColor" size={16} />
                  </div>
                </div>
              )}
              {/* HORIZONTAL CONNECTOR (R to L on odd rows) */}
              {!isEvenRow && !isFirstInRow && !isLastSkill && (
                <div
                  className={`absolute top-1/2 right-full w-8 h-px -translate-y-1/2 border-t-2 border-dashed ${connectorColor} z-[-1]`}
                >
                  <div
                    className={`absolute top-1/2 left-[-10px] -translate-y-1/2 ${arrowColor} transform -scale-x-100`}
                  >
                    <Play fill="currentColor" size={16} />
                  </div>
                </div>
              )}
              {/* VERTICAL CONNECTOR */}
              {!isLastSkill &&
                ((isEvenRow && isLastInRow) ||
                  (!isEvenRow && isFirstInRow)) && (
                  <div
                    className={`absolute top-full left-1/2 w-px h-16 -translate-x-1/2 border-l-2 border-dashed ${connectorColor} z-[-1]`}
                  >
                    <div
                      className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 ${arrowColor} transform rotate-90`}
                    >
                      <Play fill="currentColor" size={16} />
                    </div>
                  </div>
                )}

              <div
                className={`relative h-36 p-3 flex flex-col justify-between bg-gray-800/70 border-2 rounded-xl transition-colors ${
                  isCompleted ? colors.border : "border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                    <span className={`text-xs font-semibold ${colors.text}`}>
                      {levelInfo.level}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={16} className="text-white" />
                    ) : (
                      <Circle size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-200 break-words">
                  {skill}
                </h4>
              </div>
              <div
                className={`absolute -bottom-11 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-purple-600 to-blue-500`}
              >
                {getSnakeNumber(index)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillMap;
