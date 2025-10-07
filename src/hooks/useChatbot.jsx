import { useState } from "react";
import { careerSkillsData } from "../data/careerSkills";
import SkillMap from "../components/SkillMap";
import TrendingSkills from "../components/TrendingSkills";
import LoadingIndicator from "../components/LoadingIndicator";

export const useChatbot = () => {
  console.log('🚀 useChatbot hook loaded - version 2.2');
  
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

  const addMessage = (type, content, component = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
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
    return (
      <SkillMap
        skills={skills}
        userSkills={userSkills}
        career={userProfile.career}
      />
    );
  };

  const handleCareerSelection = async (career) => {
    console.log('handleCareerSelection called with:', career);
    
    let matchedCareerKey = Object.keys(careerSkillsData).find(
      (key) => key.includes(career) || career.includes(key)
    );
    
    console.log('matchedCareerKey:', matchedCareerKey);

    if (matchedCareerKey) {
      console.log('Matched career found, proceeding with API call');
      
      // Show loading message with loading component
      addMessage(
        "bot",
        `Excellent choice! Analyzing live job postings for a ${matchedCareerKey}...`,
        <LoadingIndicator message={`Fetching real-time job data for ${matchedCareerKey}...`} />
      );

      try {
        console.log('Starting API call to fetch live job data...');
        
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
        
        const response = await fetch(
          `http://localhost:3000/api/trending-skills?career=${encodeURIComponent(
            matchedCareerKey
          )}`,
          {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        clearTimeout(timeoutId);
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const liveData = await response.json();
        console.log('Successfully received live data:', liveData);
        
        // Successfully got live data - update user profile
        setUserProfile((prev) => ({
          ...prev,
          career: matchedCareerKey,
          suggestedSkills: liveData.trending_skills,
        }));

        // Show success message with live data
        console.log('✅ Adding success message with TrendingSkills component');
        addMessage(
          "bot",
          "✅ Analysis complete! Here are the latest insights based on real-time job data:",
          <TrendingSkills data={liveData} career={matchedCareerKey} />
        );

        // Show the skills list from LIVE data ONLY after API success
        console.log('🎯 Adding skills list message');
        const skillsList = liveData.trending_skills
          .slice(0, 8)
          .map((skill) => `• ${skill}`)
          .join("\n");

        addMessage(
          "bot",
          `🎯 Based on real-time job market analysis, the top skills to focus on are:\n\n${skillsList}`
        );

        // Ask about skill roadmap immediately (no timeout)
        console.log('❓ Adding roadmap question');
        addMessage(
          "bot",
          "Would you like me to create a detailed skill development roadmap for you? (Type 'yes' or 'no')"
        );
        setCurrentStage("skill_map_request");
        
      } catch (error) {
        console.error("Failed to fetch live job data:", error);
        console.log("Error details:", error.message);
        console.log("Error name:", error.name);
        
        // Check if it was an abort/timeout error
        if (error.name === 'AbortError') {
          console.log('Request was aborted due to timeout');
        }
        
        // Fallback to mock data ONLY when API actually fails
        const mockSkills = careerSkillsData[matchedCareerKey];
        
        // Update user profile with mock data
        setUserProfile((prev) => ({
          ...prev,
          career: matchedCareerKey,
          suggestedSkills: mockSkills,
        }));

        // Show error message and fallback
        const errorMessage = error.name === 'AbortError' 
          ? 'The request took too long (over 2 minutes)' 
          : error.message;
          
        addMessage(
          "bot",
          `⚠️ I had trouble accessing live job market data (${errorMessage}). No worries! I'll use my comprehensive knowledge base instead.`
        );

        // Show the skills list from MOCK data (only on actual error)
        console.log('📚 Adding mock skills list');
        const skillsList = mockSkills
          .slice(0, 8)
          .map((skill) => `• ${skill}`)
          .join("\n");

        addMessage(
          "bot",
          `📚 Based on my knowledge base, here are the core skills you'll need:\n\n${skillsList}`
        );

        // Ask about skill roadmap immediately (no timeout)
        addMessage(
          "bot",
          "Would you like me to create a detailed skill development roadmap for you? (Type 'yes' or 'no')"
        );
        setCurrentStage("skill_map_request");
      }
    } else {
      addMessage(
        "bot",
        "I'd love to help with that! Here are some careers I can guide you on:\n\n• Frontend Developer\n• Backend Developer\n• Data Scientist\n• UI/UX Designer\n• DevOps Engineer\n\nWhich one interests you?"
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
          "Now, please tell me which of these skills do you already know? You can list them separated by commas."
        );
        setCurrentStage("user_skills_input");
      }, 2000);
    } else {
      addMessage(
        "bot",
        "No problem! Which of the suggested skills do you already know? Please list them separated by commas."
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
      `Great! I've marked these as completed: ${validSkills.join(", ")}`
    );
    setTimeout(() => {
      const updatedSkillMap = generateSkillMap(
        userProfile.suggestedSkills,
        validSkills
      );
      addMessage(
        "bot",
        "Based on your existing skills, here's your updated roadmap:",
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
            `You have a solid foundation. The skills to focus on next are: ${skillsNeeded
              .slice(0, 5)
              .join(", ")}${
              skillsNeeded.length > 5
                ? ` and ${skillsNeeded.length - 5} more`
                : ""
            }.\n\nYour roadmap shows the recommended learning path.`
          );
        } else {
          addMessage(
            "bot",
            "Amazing! You have all the essential skills for this career. You're well-prepared!"
          );
        }
        setCurrentStage("career_selection");
      }, 3000);
    }, 1500);
  };

  const handleSendMessage = async () => {
    console.log('💬 handleSendMessage called with inputValue:', inputValue);
    if (!inputValue.trim()) return;
    addMessage("user", inputValue);
    const userInput = inputValue.toLowerCase().trim();
    console.log('🔍 Processing user input:', userInput, 'in stage:', currentStage);
    setInputValue("");
    simulateTyping();
    setTimeout(() => {
      console.log('🔄 Timeout reached, switching on currentStage:', currentStage);
      switch (currentStage) {
        case "career_selection":
          console.log('🎯 Calling handleCareerSelection with:', userInput);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  };
};
