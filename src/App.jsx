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

  const handleGenerateProjects = async () => {
    setLoading(true);
    setError("");
    setProjects([]);

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

      <div>
        <label>Technologies:</label>
        <div>
          <input
            type="text"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a language and press Enter"
          />
          <button
            onClick={handleAddLanguage}
            disabled={languagesList.length >= 3}
          >
            Add Language
          </button>
        </div>

        <div>
          {languagesList.map((language, index) => (
            <div key={index} className="language-tag">
              <span>{language}</span>
              <button onClick={() => handleRemoveLanguage(language)}>x</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>Difficulty:</label>
        <div className="difficulty-slider">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
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

      <div>
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

      <button onClick={handleGenerateProjects} disabled={loading}>
        {loading ? "Generating..." : "Generate Projects"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {projects.map((project, index) => (
          <div key={index} className="project">
            <h2>{project.title}</h2>
            <p><strong>Short Description:</strong> {project.short_description}</p>
            <p><strong>Long Description:</strong> {project.long_description}</p>
            <p><strong>Tech Stack:</strong> {project.tech_stack.join(", ")}</p>
            <p><strong>Implementation Steps:</strong> {project.implementation_instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;