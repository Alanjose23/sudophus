import { useState } from 'react'
import Journal from './journal'
import Loginscreen from './login'

import './App.css'

function App() {
  let [screen, setScreen] = useState("home")
  let [count, setCount] = useState(0)
  let [user, setUser] = useState(false)
 


  const journalClick = () => {
    setCount(count + 1)
    setScreen("journal")
  }
  const loginClick = () => {
    setScreen("login")
  }
  const backClick = () => {
    if(screen == "login") {
      setCount(count * 0)
    }
    
    setScreen("home")
    
  }

  switch(screen) {

    case "journal":
    return (
        <div>
      
      <Journal entryC = {count}/>
    <button onClick = {backClick} >Go Back</button>
    </div>
    )

    case "login": 
      return (
        <div>
          <Loginscreen/>
          <button onClick = {backClick}>Go Back</button>
        </div>
      )


  default: return (
    <div className = "container">
    
      <div style  = {{ textalign: 'center'}}>
        <img src="../public/sudo.jpg" class = "rounded corners" alt="climb the mountain" />
      <h1>Sudophus</h1>
      <h4>Welcome to Sudophus,a simple React Journaling Application which documents progress of your coding journey and helps maintain your mental health</h4>
      </div>
      <div className="card">
        <button onClick={journalClick}>
          log entries {count}
        </button>
        <p>
          Click this button to add a journal entry
        </p>
      </div>
      <div className = "card">
        <button>Projects</button>
      </div>
      <div className = "card">
        <button onClick = {loginClick}>Login</button>
      </div>
      <div textalign = "center">Current amount of project entries: </div>
  </div> )}
   
  
    
      }


export default App

