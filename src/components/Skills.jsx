import React, { useState, useEffect } from 'react';
import LoadingIndicator from "./LoadingIndicator"

const BASE_URL = "http://127.0.0.1:8000";

const Skills = () => {
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [knownInput, setKnownInput] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_skills`);
      const data = await res.json();
      const content = data.skills ? data.skills : data;
      setSkills(content);
      setTimestamp(new Date().toLocaleString());
    } catch (e) {
      console.error(e);
      setSkills({ error: 'Failed to load skills. Check backend.' });
    } finally {
      setLoading(false);
    }
  };

  const removeKnownSkills = async () => {
    if (!knownInput.trim()) return alert("Please enter at least one skill name.");
    const knownList = knownInput.split(',').map(x => x.trim());
    try {
      const res = await fetch(`${BASE_URL}/remove_known_skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ known_skills: knownList })
      });
      const data = await res.json();
      const content = data.updated_skills ? data.updated_skills : data;
      setSkills(content);
      setTimestamp(new Date().toLocaleString());
      alert("✅ Known skills removed and list updated!");
      setKnownInput('');
    } catch (e) {
      alert("⚠️ Backend connection failed.");
    }
  };

  const toggleCategory = (catName) => {
    setSkills(prev => ({
      ...prev,
      [catName]: {
        ...prev[catName],
        collapsed: !prev[catName]?.collapsed
      }
    }));
  };

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  if (skills?.error) {
    return (
      <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center">
        <div className="text-xl">{skills.error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-black text-gray-300 p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">📘 Recommended Skill List</h1>
        <div className="text-center text-sm text-purple-400 mb-6">Last updated: {timestamp}</div>

        {Object.entries(skills).map(([sectionName, sectionData], sectionIndex) => {
          if (typeof sectionData !== 'object' || sectionData.collapsed !== undefined) return null;
          const sectionTitle = sectionName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return (
            <div key={sectionName}>
              <div className="text-xl font-semibold text-center text-blue-400 border-b-2 border-gray-700 pb-1 max-w-3xl mx-auto mb-4 mt-10">
                {sectionTitle}
              </div>
              {Object.entries(sectionData).map(([catName, skillsList], i) => {
                const catTitle = catName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const isCollapsed = skills[catName]?.collapsed || false;
                return (
                  <div key={catName} className="bg-gray-800 rounded-lg p-5 mb-5 max-w-3xl mx-auto shadow-lg">
                    <div
                      className="flex justify-between items-center cursor-pointer select-none text-lg font-medium text-purple-300 border-b border-gray-600 pb-2 mb-3"
                      onClick={() => toggleCategory(catName)}
                    >
                      <div>{catTitle}</div>
                      <span className={`text-sm text-gray-500 transition-all duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>➤</span>
                    </div>
                    {!isCollapsed && (
                      <div className="space-y-3">
                        {(skillsList || []).map((skill, idx) => (
                          <div key={idx} className="bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                            <div className="font-semibold text-blue-300 text-lg">{skill.name || 'Unnamed Skill'}</div>
                            <div className="text-gray-400 mt-2 leading-relaxed">{skill.reason || 'No description provided.'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="bg-gray-800 rounded-lg p-6 mt-8 max-w-3xl mx-auto shadow-lg">
          <label className="block text-gray-400 text-sm mb-2">Enter skills you already know (comma-separated):</label>
          <div className="flex">
            <input
              type="text"
              value={knownInput}
              onChange={(e) => setKnownInput(e.target.value)}
              placeholder="e.g., JavaScript, HTML, CSS"
              className="flex-1 p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={removeKnownSkills}
              className="ml-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Remove Known Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
