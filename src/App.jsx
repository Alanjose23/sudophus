import { useState } from 'react'
import Journal from './journal'

import './App.css'

function App() {
  var [count, setCount] = useState(0)
  var [entry, setEntry] = useState(false)
  var [project, setProject] = useState(0)


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
      <h4>Welcome to Sudophus,a simple React Journaling Application which documents progress of your coding journey and helps maintain your mental health</h4>
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
        <button onClick = {() => {
          setProject(project + 1);
        }}>add to PROJECTBASE</button>
      </div>
      <div textAlign = "center">Current amount of project entries: {(project)}</div>
     
    </>
    ): ( <><Journal entryC = {count}/>
    <button onClick = {() => {setEntry(false) 
    setCount(count-1)}}>Go Back</button></>
    
  )}
    </div>
  )
}

export default App

