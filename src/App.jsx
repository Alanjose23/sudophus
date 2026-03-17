import { useState } from 'react'
import Journal from './journal'
import Loginscreen from './login'
import Project from './project'
import quotes from './quotes'

import './App.css'

function App() {
  let [screen, setScreen] = useState("home")
  let [count, setCount] = useState(0)
  let [user, setUser] = useState(false)
  let [quote, setQuotes] = useState("")
  
  
 

  const quoteChange = () => {
    let x = Math.random() * (100 - 0) + 0
    console.log(quotes[Math.round(x)])
    
  }
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
  const projectclick = () => {
    setScreen("project")
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
    case "project": 
      return (
        <div>
          <Project/>
          <button onClick = {backClick}>Go Back</button>
        </div>
      )  


  default: return (
    <div className = "container">
    
      <div style  = {{ textalign: 'center'}}>
        <img src="../public/sudo.jpg" alt="climb the mountain" />
      <h1>Sudophus</h1>
      <h4>A Journaling Application which documents progress of your coding journey and helps maintain your mental health.</h4>
      <h6><i>QUOTES ELEMENT</i></h6>
      <button onClick = {quoteChange}>Change quote</button>
      </div>
      <div className="card">
        <button onClick={journalClick}>
          log entries {count}
        </button>
        <p>
          Add a new page in your life
        </p>
      </div>
      <div className = "card">
        <button onClick = {projectclick}>Projects</button>
        <p>Create something unique</p>
      </div>
      <div className = "card">
        <button onClick = {loginClick}>Login</button>
        <p>Start tracking your journey</p>
      </div>
      <div textalign = "center">Current amount of project entries: </div>
  </div> )}
   
  
    
      }


export default App

