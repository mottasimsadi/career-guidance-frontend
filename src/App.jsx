import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Bot,
  MapPin,
  CheckCircle,
  Circle,
  ArrowRight,
  Star,
  Target,
  Trophy,
  BookOpen,
} from "lucide-react";

const CareerGuidanceChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your Career Guidance Assistant. What career are you interested in pursuing? (e.g., Frontend Developer, Data Scientist, UI/UX Designer, etc.)",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [currentStage, setCurrentStage] = useState("career_selection");
  const [userProfile, setUserProfile] = useState({
    career: "",
    suggestedSkills: [],
    userSkills: [],
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample career data - will be replaced with Flask API calls
  const careerSkillsData = {
    "frontend developer": [
      "HTML/CSS",
      "JavaScript",
      "React",
      "Vue.js",
      "TypeScript",
      "Responsive Design",
      "Git/Version Control",
      "Testing (Jest/Cypress)",
      "Build Tools (Webpack/Vite)",
      "State Management",
      "API Integration",
      "Performance Optimization",
    ],
    "backend developer": [
      "Python/Node.js",
      "Database Design",
      "API Development",
      "Authentication & Security",
      "Cloud Services (AWS/Azure)",
      "Docker",
      "Testing",
      "System Design",
      "Microservices",
      "Message Queues",
      "Caching",
      "Monitoring & Logging",
    ],
    "data scientist": [
      "Python/R",
      "Statistics & Probability",
      "Machine Learning",
      "SQL",
      "Data Visualization",
      "Pandas/NumPy",
      "Deep Learning",
      "Big Data Tools",
      "Feature Engineering",
      "Model Deployment",
      "A/B Testing",
      "Business Intelligence",
    ],
    "ui/ux designer": [
      "Figma/Adobe XD",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
      "Information Architecture",
      "Visual Design",
      "Interaction Design",
      "Accessibility",
      "Design Thinking",
      "Agile/Design Sprint",
    ],
    "devops engineer": [
      "Linux/Unix",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Cloud Platforms",
      "Infrastructure as Code",
      "Monitoring & Alerting",
      "Security",
      "Scripting",
      "Configuration Management",
      "Networking",
      "Database Administration",
      "Incident Response",
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, content, component = null) => {
    const newMessage = {
      id: messages.length + 1,
      type,
      content,
      component,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = (duration = 1200) => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), duration);
  };

  const generateSkillMap = (skills, userSkills = []) => {
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
      if (index < 8)
        return { level: "Core Skills", color: "blue", icon: Target };
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
              Your personalized learning path for {userProfile.career}
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

                            const isLastSkill =
                              actualIndex === skills.length - 1;
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
                              isLastInRow &&
                              !isLastSkill &&
                              rowIndex < rows - 1;

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
                                          !isEvenRow
                                            ? "transform rotate-180"
                                            : ""
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
              <span className="text-sm text-gray-700">
                Advanced (Skills 9+)
              </span>
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    addMessage("user", inputValue);
    const userInput = inputValue.toLowerCase().trim();
    setInputValue("");

    simulateTyping();

    setTimeout(() => {
      switch (currentStage) {
        case "career_selection":
          handleCareerSelection(userInput);
          break;
        case "skill_map_request":
          handleSkillMapRequest(userInput);
          break;
        case "user_skills_input":
          handleUserSkillsInput(userInput);
          break;
        default:
          addMessage(
            "bot",
            "Let's start over! What career are you interested in?"
          );
          setCurrentStage("career_selection");
      }
    }, 1200);
  };

  const handleCareerSelection = (career) => {
    // Find matching career from available options
    let matchedCareer = null;
    let matchedSkills = [];

    for (const [careerKey, skills] of Object.entries(careerSkillsData)) {
      const careerWords = careerKey.split(" ");
      const hasMatch = careerWords.some(
        (word) =>
          career.includes(word) ||
          word.includes(career.replace(/[^a-zA-Z]/g, ""))
      );

      if (
        hasMatch ||
        career.includes(careerKey) ||
        careerKey.includes(career)
      ) {
        matchedCareer = careerKey;
        matchedSkills = skills;
        break;
      }
    }

    if (matchedCareer) {
      setUserProfile((prev) => ({
        ...prev,
        career: matchedCareer,
        suggestedSkills: matchedSkills,
      }));

      addMessage(
        "bot",
        `Excellent choice! For a ${matchedCareer}, here are the key skills you'll need to master:`
      );

      setTimeout(() => {
        const skillsList = matchedSkills
          .slice(0, 8)
          .map((skill, index) => `• ${skill}`)
          .join("\n");

        addMessage("bot", skillsList);

        setTimeout(() => {
          addMessage(
            "bot",
            "Would you like me to create a detailed skill development roadmap for you? This will show you the learning path and skill progression. (Type 'yes' or 'no')"
          );
          setCurrentStage("skill_map_request");
        }, 1500);
      }, 1000);
    } else {
      addMessage(
        "bot",
        "I'd love to help you with that career path! Could you be more specific? Here are some careers I can help with:\n\n• Frontend Developer\n• Backend Developer\n• Data Scientist\n• UI/UX Designer\n• DevOps Engineer\n\nWhich one interests you?"
      );
    }
  };

  const handleSkillMapRequest = (response) => {
    if (
      response.includes("yes") ||
      response.includes("sure") ||
      response.includes("okay") ||
      response.includes("please")
    ) {
      const skillMap = generateSkillMap(userProfile.suggestedSkills);

      addMessage(
        "bot",
        "Here's your personalized skill development roadmap:",
        skillMap
      );

      setTimeout(() => {
        addMessage(
          "bot",
          "Now, please tell me which of these skills do you already know? You can list them separated by commas.\n\nFor example: 'HTML/CSS, JavaScript, Git, Python'"
        );
        setCurrentStage("user_skills_input");
      }, 2000);
    } else {
      addMessage(
        "bot",
        "No problem! Let's skip the visual roadmap for now. Which of the suggested skills do you already know? Please list them separated by commas.\n\nFor example: 'HTML/CSS, JavaScript, Git'"
      );
      setCurrentStage("user_skills_input");
    }
  };

  const handleUserSkillsInput = (skillsInput) => {
    const userSkillsList = skillsInput.split(",").map((skill) => skill.trim());
    const validSkills = userSkillsList.filter((skill) => skill.length > 0);

    setUserProfile((prev) => ({ ...prev, userSkills: validSkills }));

    addMessage(
      "bot",
      `Great! I can see you have experience with: ${validSkills.join(", ")}`
    );

    setTimeout(() => {
      const updatedSkillMap = generateSkillMap(
        userProfile.suggestedSkills,
        validSkills
      );
      addMessage(
        "bot",
        "Based on your existing skills, here's your updated personalized roadmap:",
        updatedSkillMap
      );

      setTimeout(() => {
        const skillsNeeded = userProfile.suggestedSkills.filter(
          (skill) =>
            !validSkills.some(
              (userSkill) =>
                skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                userSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );

        if (skillsNeeded.length > 0) {
          addMessage(
            "bot",
            `Perfect! You have a solid foundation. The skills you still need to develop are: ${skillsNeeded
              .slice(0, 5)
              .join(", ")}${
              skillsNeeded.length > 5
                ? ` and ${skillsNeeded.length - 5} more`
                : ""
            }.\n\nYour roadmap above shows your current progress and the recommended learning path. Follow the numbered sequence and arrows from left to right, completing Foundation skills first, then Core Skills, and finally Advanced topics.`
          );
        } else {
          addMessage(
            "bot",
            "Amazing! You already have all the essential skills for this career path. You're well-prepared to pursue opportunities in this field!"
          );
        }

        // Reset for new conversation
        setCurrentStage("career_selection");
      }, 3000);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-xl lg:max-w-5xl ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-indigo-600 ml-3"
                      : "bg-gray-700 mr-3"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`px-6 py-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 shadow-md border border-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.component && (
                    <div className="mt-3">{message.component}</div>
                  )}
                  <div
                    className={`text-xs mt-2 ${
                      message.type === "user"
                        ? "text-indigo-200"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-xs lg:max-w-2xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 mr-3 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl shadow-md border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="1"
                style={{ minHeight: "52px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors duration-200 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidanceChatbot;
