import { useState } from "react";
import "./App.css";

function App() {
  const [languages, setLanguages] = useState("");
  const [languagesList, setLanguagesList] = useState([]); // Store list of added languages
  const [difficulty, setDifficulty] = useState(1);
  const [projectType, setProjectType] = useState("web application");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projectGenerated, setProjectGenerated] = useState(false); // New state to track if the project is generated

  const handleGenerateProjects = async () => {
    setLoading(true);
    setError("");
    setProjects([]);
    setProjectGenerated(false); // Reset project generated state

    const requestData = {
      languages: languagesList,
      difficulty: difficulty.toString(),
      project_type: projectType,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setProjects(data.project_ideas);
          setProjectGenerated(true); // Set projectGenerated to true after the project is generated
        }
      } else {
        setError("Error: " + response.statusText);
      }
    } catch (err) {
      setError("Failed to fetch project ideas. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && languages.trim() !== "" && languagesList.length < 3) {
      handleAddLanguage();
    }
  };

  const handleAddLanguage = () => {
    if (languages.trim() !== "" && languagesList.length < 3) {
      setLanguagesList((prevList) => [...prevList, languages.trim()]);
      setLanguages(""); // Reset input after adding
    }
  };

  const handleRemoveLanguage = (languageToRemove) => {
    setLanguagesList((prevList) => prevList.filter((lang) => lang !== languageToRemove));
  };

  return (
    <div className="App">
      <h1>Project Idea Generator</h1>

      <div className="input-container">
        {/* Combined container for technologies and difficulty */}
        <div className="combined-container">
          <div className="technologies-container">
            <label>Enter Technologies:</label>
            <div className="input-section">
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a language and press Enter"
                className="technology-input"
              />
              <button
                onClick={handleAddLanguage}
                disabled={languagesList.length >= 3}
                className="add-language-button"
              >
                Add Language
              </button>
            </div>

            <div className="language-tags">
              {languagesList.map((language, index) => (
                <div key={index} className="language-tag">
                  <span>{language}</span>
                  <button onClick={() => handleRemoveLanguage(language)} className="remove-language-button">x</button>
                </div>
              ))}
            </div>
          </div>

          <div className="difficulty-container">
            <label className="difficulty-label">Difficulty:</label>
            <label className="side-title">Adjust the complexity level of the project generated</label>
            <div className="difficulty-slider">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="difficulty-input"
                style={{
                  backgroundSize: `${(difficulty - 1) * 25}% 100%`,
                }}
              />
              <div className="difficulty-labels">
                {["Beginner", "Easy", "Medium", "Hard", "Advanced"].map((label, index) => (
                  <span
                    key={index}
                    className={`label-${index + 1} ${difficulty === index + 1 ? "active" : ""}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="project-type-container">
          <label>Project Type:</label>
  
          <div className="project-type-buttons">
            <button
              onClick={() => setProjectType("web application")}
              className={projectType === "web application" ? "active" : ""}
            >
              Web Application
            </button>
            <button
              onClick={() => setProjectType("mobile application")}
              className={projectType === "mobile application" ? "active" : ""}
            >
              Mobile Application
            </button>
            <button
              onClick={() => setProjectType("machine learning")}
              className={projectType === "machine learning" ? "active" : ""}
            >
              Machine Learning
            </button>
            <button
              onClick={() => setProjectType("game development")}
              className={projectType === "game development" ? "active" : ""}
            >
              Game Development
            </button>
          </div>
        </div>
      </div>

      <button 
        className="generate-button"
        onClick={handleGenerateProjects} 
        disabled={loading || languagesList.length === 0}
      >
        {loading ? "Generating..." : "Generate Projects"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="output-container">
        {projects.map((project, index) => (
          <div key={index} className="project">
            <h2>{project.title}</h2>

            {/* Short Description */}
            <div className="description">
              <p><strong>Short Description:</strong></p>
              <p>{project.short_description}</p>
            </div>

            {/* Long Description */}
            <div className="description">
              <p><strong>Long Description:</strong></p>
              <p>{project.long_description}</p>
            </div>

            {/* Tech Stack */}
            <div className="description">
              <p><strong>Tech Stack:</strong></p>
              <p>{project.tech_stack.join(", ")}</p>
            </div>

            {/* Implementation Steps */}
            <div className="description">
              <p><strong>Implementation Steps:</strong></p>
              <div className="implementation-steps">
                {project.implementation_instructions
                  .split(/\d+\./) // Splits based on numbers followed by a period (e.g., "1.", "2.")
                  .filter(step => step.trim()) // Filters out any empty strings
                  .map((step, idx) => (
                    <p key={idx} className="step">{idx + 1}. {step.trim()}</p>
                  ))}
              </div>
            </div>

          </div> // Close the project div
        ))}
      </div>
    </div> // Close the App div
  );
}

export default App;
