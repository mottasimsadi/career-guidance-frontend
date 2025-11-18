import React, { useState, useEffect } from 'react';

const BASE_URL = "http://127.0.0.1:8000";

const LearningPlan = () => {
  const [plan, setPlan] = useState(null);
  const [calibration, setCalibration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_learning_plan`);
      const data = await res.json();
      if (data.error) {
        setPlan({ error: data.error });
        return;
      }
      setPlan(data.plan);
      setCalibration(data.calibration);
      setTimestamp(new Date().toLocaleString());
    } catch (e) {
      setPlan({ error: 'Failed to load plan.' });
      console.error('Error loading plan:', e);
    } finally {
      setLoading(false);
    }
  };

  const makeList = (arr, icon = "🔹") => {
    if (!Array.isArray(arr) || !arr.length) return <p className="text-gray-500">None</p>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {arr.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (plan?.error) {
    return (
      <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center">
        <div className="text-xl">{plan.error}</div>
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
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">📘 Your Personalized Learning Plan</h1>
        <div className="text-center text-sm text-purple-400 mb-6">Last updated: {timestamp}</div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-2 mb-4">🎯 Learning Plan</h2>
          {plan && (
            <>
              <div className="bg-gray-700 rounded-lg p-5 mb-6">
                <h3 className="text-xl font-medium text-purple-300 mb-3">📖 Overview</h3>
                <p className="leading-relaxed">{plan.overview}</p>
              </div>

              {plan.plan.map((p, i) => {
                const label = p.quarter ? `Quarter ${p.quarter}` : p.month ? `Month ${p.month}` : `Stage ${i + 1}`;
                const dur = p.duration_months ? `${p.duration_months} month${p.duration_months > 1 ? 's' : ''}` : '';
                const hrs = p.available_hours || p.estimated_hours || '';
                return (
                  <div key={i} className="bg-gray-700 rounded-lg p-5 mb-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                    <h3 className="text-lg font-semibold text-blue-300 border-b border-gray-600 pb-2 mb-3">
                      📅 {label}{dur && <span className="text-sm text-gray-400 ml-2">({dur})</span>}
                    </h3>
                    {p.theme && <div className="italic text-purple-400 mb-3">{p.theme}</div>}

                    <h4 className="font-medium text-green-400 mb-2">🎯 Skills Focus</h4>
                    {makeList(p.skills_focus)}

                    <h4 className="font-medium text-green-400 mb-2 mt-4">📚 Topics</h4>
                    {makeList(p.topics)}

                    <h4 className="font-medium text-green-400 mb-2 mt-4">🎓 Objectives</h4>
                    {makeList(p.objectives)}

                    <h4 className="font-medium text-green-400 mb-2 mt-4">🧩 Projects</h4>
                    {Array.isArray(p.projects) ? (
                      <div className="space-y-2">
                        {p.projects.map((x, idx) =>
                          typeof x === 'string' ? (
                            <div key={idx} className="bg-gray-600 rounded p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">{x}</div>
                          ) : (
                            <div key={idx} className="bg-gray-600 rounded p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                              <strong className="text-blue-300">{x.name}</strong><br />
                              <em className="text-gray-400">{x.description}</em><br />
                              {x.expected_output && <span className="text-gray-500">📝 {x.expected_output}</span>}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">None</p>
                    )}

                    <h4 className="font-medium text-green-400 mb-2 mt-4">📘 Resources</h4>
                    {makeList(p.resources)}

                    {hrs && <div className="text-right text-sm text-blue-400 mt-3">⏱ Estimated Hours: {hrs}</div>}
                  </div>
                );
              })}

              {Array.isArray(plan.tips) && plan.tips.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-5 mt-6">
                  <h3 className="text-xl font-medium text-purple-300 border-b border-gray-600 pb-2 mb-3">💡 Tips for Success</h3>
                  <ul className="list-none space-y-2">
                    {plan.tips.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>💡</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-2 mb-4">⏱️ Time & Effort Calibration</h2>
          {calibration ? (
            <div className="space-y-3">
              <p><strong className="text-purple-300">Feasibility:</strong> {calibration.feasibility || 'N/A'}</p>
              <p><strong className="text-purple-300">Analysis:</strong> {calibration.analysis || 'N/A'}</p>
              <div className="bg-gray-700 p-4 rounded whitespace-pre-wrap text-gray-400">
                <strong className="text-purple-300">Recommendation:</strong> {calibration.recommendation?.message_to_user || 'N/A'}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No calibration data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlan;
