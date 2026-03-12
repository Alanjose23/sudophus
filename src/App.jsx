import { useState } from 'react'
import Journal from './journal'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [entry, setEntry] = useState(false)


  const handleClick = () => {
    setCount(count + 1)
    setEntry(true)
  }
  return (
    <div className = "container">
      {!entry ? ( 
    <>
      <div style  = {{ textAlign: 'center'}}>
        <img src="../public/sudo.jpg" class = "rounded corners" alt="climb the mountain" />
      <h1>Sudophus</h1>
      <h4>Welcome to Sudophus,a simple React Journaling Application which documents progress of your coding journey</h4>
      </div>
      <div className="card">
        <button onClick={handleClick}>
          log entries {count}
        </button>
        <p>
          Click this button to add a journal entry
        </p>
      </div>
      <div className = "card">
        <button>add to PROJECTBASE</button>
      </div>
     
    </>
    ): ( <><Journal entryC = {count}/>
    <button onClick = {() => {setEntry(false) 
    setCount(count-1)}}>Go Back</button></>
    
  )}
    </div>
  )
}

export default App

