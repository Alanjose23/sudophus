import { useState } from "react"


function Project() {

    let [user, setUser] = useState(null);
    let [starred, setStarred] = useState(false);


    return (
        <div>
             <h3>My First Project</h3>
      <p>
        A coding journal tracker that helps developers document their
        learning progress and maintain accountability.
      </p>
      <span
        onClick={() => setStarred(!starred)}
        style={{ cursor: "pointer", fontSize: "24px" }}
      >
        {starred ? "★" : "☆"}
      </span>
      <hr />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </p>
        </div>


    )

}



export default Project;