import { useState } from "react";
import React from "react";

const BASE_URL = "http://127.0.0.1:8000";

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "agent",
      text: "👋 Hi! I'm your AI Career Guidance Agent.<br>Would you like help preparing for a <b>Software Engineering</b> or <b>Data Analyst</b> job?",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Re-introduced isLoading for the main indicator

  const addMessage = (text, sender = "agent", html = false) => {
    const msg = {
      sender,
      text: html ? text : text.replace(/\n/g, "<br>"),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const api = async (path, method = "GET", body = null) => {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
      try {
        return JSON.parse(text);
      } catch {
        console.warn("Invalid JSON:", text);
        return { error: "Invalid JSON", raw: text };
      }
    } catch (e) {
      addMessage(`⚠️ Error: ${e.message}`, "agent");
      throw e;
    }
  };

  const nextStep = async (userInput) => {
    addMessage(userInput, "user");
    setIsTyping(true); // Show the small "Thinking..." bubble immediately

    // A small delay to make the "Thinking..." indicator visible
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (step) {
      // Cases 0-3 are fast and don't need the main loader
      case 0:
        const newData0 = userInput.toLowerCase().includes("data")
          ? { ...data, job_role: "data_analyst" }
          : { ...data, job_role: "software_engineer" };
        setData(newData0);
        addMessage("🌍 Do you want to prepare for Bangladesh or Global market?");
        setStep(1);
        setIsTyping(false);
        break;

      case 1:
        const location = userInput.toLowerCase().includes("bang")
          ? "Bangladesh"
          : "Global";
        const newData1 = { ...data, location };
        setData(newData1);
        if (newData1.job_role === "software_engineer") {
          addMessage("⚙️ Which specialization are you interested in? (Frontend, Backend, Full-Stack, DevOps, or Mobile)");
        } else {
          addMessage("📊 Which area would you like to focus on? (BI Analyst, SQL Analyst, or Data Visualization)");
        }
        setStep(2);
        setIsTyping(false);
        break;

      case 2:
        const persona = userInput.trim();
        const newData2 = { ...data, persona };
        setData(newData2);
        addMessage(`Got it! You want to prepare for <b>${persona}</b>.`, "agent", true);
        addMessage("⏱️ How much time do you have to prepare? (e.g., 6 months, 1 year)");
        setStep(3);
        setIsTyping(false);
        break;

      case 3:
        const time_preference = userInput.trim();
        const newData3 = { ...data, time_preference };
        setData(newData3);
        addMessage(`Okay, noted: ${time_preference}.`, "agent");
        addMessage("Any special preferences? (e.g., already know Java, prefer remote) — or say 'no'.");
        setStep(4);
        setIsTyping(false);
        break;

      // Case 4 is a long-running API call, so we use the main loader
      case 4:
        setIsTyping(false); // Turn off the small "Thinking..." indicator
        setIsLoading(true); // Turn on the main LoadingIndicator component
        const preference = userInput.toLowerCase().includes("no") ? "" : userInput;
        const newData4 = { ...data, preference };
        setData(newData4);
        try {
          const res = await api("/generate_skills", "POST", newData4);
          if (res.error) {
            addMessage("⚠️ Failed to generate skills. Please try again.", "agent");
          } else {
            // Get skills data for preview
            const skillsData = res.skills || res;
            let previewSkills = [];

            console.log('Skills data structure:', skillsData);

            // Extract max 2 skills from each category (core_skills, supporting_skills, advanced_skills, professional_skills)
            if (typeof skillsData === 'object' && skillsData !== null) {
              const categoryNames = ['core_skills', 'supporting_skills', 'advanced_skills', 'professional_skills'];

              for (const categoryName of categoryNames) {
                if (skillsData[categoryName] && typeof skillsData[categoryName] === 'object') {
                  // Each category is an object with subcategories, extract from all subcategories
                  const subCategories = Object.values(skillsData[categoryName]);
                  let categorySkills = [];

                  for (const subCategory of subCategories) {
                    if (Array.isArray(subCategory)) {
                      categorySkills = categorySkills.concat(subCategory);
                    }
                  }

                  // Take max 2 skills from this category
                  const skillsToAdd = categorySkills.slice(0, 2);
                  console.log(`Category ${categoryName}:`, skillsToAdd);
                  previewSkills = previewSkills.concat(skillsToAdd);
                } else {
                  console.log(`Category ${categoryName} not found or not an object`);
                }
              }

              console.log('Total preview skills collected:', previewSkills.length);
            }

            // Fallback: if no categorized skills found, try to get from any arrays
            if (previewSkills.length === 0) {
              if (Array.isArray(skillsData)) {
                previewSkills = skillsData.slice(0, 8); // Max 8 total if no categories
              } else {
                // Find any arrays in the object
                const allArrays = [];
                const findArrays = (obj) => {
                  if (Array.isArray(obj) && obj.length > 0) {
                    allArrays.push(obj);
                  } else if (typeof obj === 'object' && obj !== null) {
                    Object.values(obj).forEach(findArrays);
                  }
                };
                findArrays(skillsData);
                if (allArrays.length > 0) {
                  previewSkills = allArrays[0].slice(0, 8);
                }
              }
            }

            // Create preview list HTML (only skill names, no descriptions)
            let previewHtml = `<div class="skills-preview mb-4">
              <h3 class="text-lg font-semibold text-purple-400 mb-3">🎯 Top Recommended Skills:</h3>
              <div class="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <ul class="space-y-2">`;

            previewSkills.forEach(skill => {
              const skillName = skill.name || skill;
              previewHtml += `<li class="text-blue-300 text-sm">• ${skillName}</li>`;
            });

            previewHtml += `</ul></div></div>`;

            addMessage("✅ Skills generated successfully! Here's a preview:", "agent");
            addMessage(previewHtml, "agent", true);

            // show button
            addMessage(
              `<button type="button" class='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-blue-700 transition-all duration-200' onclick="window.open('/skills','_blank')">📘 See Full Skill List</button>`,
              "agent", true
            );

            addMessage("Do you already know any of these skills? (List them comma-separated, or say 'no')");
            setStep(5);
          }
        } catch (e) {
          addMessage("⚠️ Something went wrong: " + e.message, "agent");
        }
        setIsLoading(false); // Turn off the main loader when the operation is complete
        break;

      // Case 5 is also a potentially long operation
      case 5:
        setIsTyping(false);
        const knownInput = userInput.trim();
        if (knownInput.toLowerCase() === "no" || knownInput.toLowerCase() === "none") {
          addMessage("Got it — keeping all recommended skills.", "agent");
        } else {
          setIsLoading(true); // Turn on main loader for the API call
          const known_skills = knownInput.split(",").map(s => s.trim());
          try {
            const res2 = await api("/remove_known_skills", "POST", { known_skills });
            if (res2.error) {
              addMessage("⚠️ Failed to update skill list.", "agent");
            } else {
              addMessage("✅ Skill list updated! You can click the same button again to view the updated version.", "agent");
            }
          } catch (e) {
            addMessage("⚠️ Something went wrong: " + e.message, "agent");
          }
          setIsLoading(false); // Turn off main loader
        }
        addMessage("<b>Next:</b> When you're ready, type 'continue' to generate your personalized learning plan.", "agent", true);
        setStep(6);
        break;

      case 6:
        if (userInput.toLowerCase().includes("continue")) {
          addMessage("⏰ How many hours can you study per day?");
          setStep(7);
        } else {
          addMessage("You can type 'continue' anytime to proceed.", "agent");
        }
        setIsTyping(false);
        break;

      // Case 7 is another long-running API call
      case 7:
        setIsTyping(false);
        setIsLoading(true); // Turn on main loader
        const hours = parseFloat(userInput.trim()) || 3;
        try {
          const res3 = await api("/generate_learning_plan", "POST", {
            job_role: data.job_role,
            time_preference: data.time_preference,
            daily_hours: hours,
          });
          if (res3.error) {
            addMessage("⚠️ Failed to generate learning plan.", "agent");
          } else {
            addMessage("✅ Learning plan generated successfully!", "agent");
            addMessage(
              `<button type="button" class='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-blue-700 transition-all duration-200' onclick="window.open('/learning-plan','_blank')">📘 See Learning Plan</button>`,
              "agent", true
            );
            addMessage("🚀 You can now review your full plan and calibration on that page!", "agent");
          }
        } catch (e) {
          addMessage("⚠️ Something went wrong: " + e.message, "agent");
        }
        setIsLoading(false); // Turn off main loader
        break;
      
      default:
        setIsTyping(false); // Fallback to ensure indicators are always turned off
        break;
    }
  };

  const handleSendMessage = async (text) => {
    const messageToSend = typeof text === "string" ? text : inputValue;
    // Prevent sending new messages while a long operation is in progress
    if (!messageToSend.trim() || isLoading) return; 
    setInputValue("");
    await nextStep(messageToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return {
    messages,
    isTyping,
    isLoading, // Export isLoading to be used in the UI
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
  };
};