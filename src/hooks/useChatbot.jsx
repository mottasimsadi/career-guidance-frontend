import { useState } from "react";
import { careerSkillsData } from "../data/careerSkills";
import SkillMap from "../components/SkillMap";

export const useChatbot = () => {
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

  const handleCareerSelection = (career) => {
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
          .map((skill) => `• ${skill}`)
          .join("\n");

        addMessage("bot", skillsList);

        setTimeout(() => {
          addMessage(
            "bot",
            "Would you like me to create a detailed skill development roadmap for you? (Type 'yes' or 'no')"
          );
          setCurrentStage("skill_map_request");
        }, 1500);
      }, 1000);
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
          "Now, please tell me which of these skills you already know. You can list them separated by commas.\n\nFor example: 'HTML/CSS, JavaScript, Git, Python'"
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
            }.\n\nYour roadmap shows the recommended learning path. Follow the numbered sequence.`
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
