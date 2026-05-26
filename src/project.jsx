import { useState } from "react"
import "./project.css"

function Project({ user }) {
  const [starred, setStarred] = useState(false)

  return (
    <div className="project-container">
      <div className="project-card">
        <div className="project-header">
          <div>
            <h3>My First Project</h3>
            {user && <p className="project-author">by {user.email}</p>}
          </div>
          <span
            onClick={() => setStarred(!starred)}
            className={`star-btn${starred ? " starred" : ""}`}
            style={{ cursor: "pointer", fontSize: "24px" }}
            title={starred ? "Unstar" : "Star this project"}
          >
            {starred ? "★" : "☆"}
          </span>
        </div>

        <p className="project-description">
          A coding journal tracker that helps developers document their
          learning progress and maintain accountability.
        </p>

        <hr className="project-divider" />

        <p className="project-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <div className="project-tags">
          <span className="tag">React</span>
          <span className="tag">Firebase</span>
          <span className="tag">Journal</span>
        </div>
      </div>
    </div>
  )
}

export default Project
