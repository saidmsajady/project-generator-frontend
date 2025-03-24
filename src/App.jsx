import { useState } from "react";
import "./App.css";

function App() {
  const [languages, setLanguages] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [projectType, setProjectType] = useState("web application");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateProjects = async () => {
    setLoading(true);
    setError("");
    setProjects([]);

    const requestData = {
      languages: languages.split(",").map((lang) => lang.trim()),
      difficulty,
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

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setProjects(data.project_ideas);
      }
    } catch (err) {
      setError("Failed to fetch project ideas. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Project Idea Generator</h1>

      <div>
        <label>Technologies (comma-separated):</label>
        <input
          type="text"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
        />
      </div>

      <div>
        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="beginner">Beginner</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label>Project Type:</label>
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
          <option value="web application">Web Application</option>
          <option value="mobile application">Mobile Application</option>
          <option value="machine learning">Machine Learning</option>
          <option value="game development">Game Development</option>
        </select>
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