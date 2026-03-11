import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div><center>
        <img src="../public/sudo.jpg" alt="climb the mountain" />
      <h1>Sudophus</h1></center>
      <h4>Welcome to Sudophus,a simple React Journaling Application which documents progress of your coding journey</h4>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          log entries {count}
        </button>
        <p>
          Click this button to add a journal entry
        </p>
      </div>
    </>
  )
}

export default App
