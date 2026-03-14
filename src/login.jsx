import {useState} from "react"


function Loginscreen() {
    var [username, setUsername] = useState(""); 
    var [password, setPassword] = useState("");
    var [email, setEmail] = useState("");
    var [users, setUsers] = useState("");

  
    
   
    switch(users){

    case "false":
        return (

            <div style = {{textAlign: "center"}}>
                <h2>User Profile Creation</h2>
                    <ul> Username: 
                        <textarea value = {username} onChange = {(e) => setUsername(e.target.value)}></textarea>
                    </ul>
                    <ul> Password: 
                        <textarea value = {password} onChange = {(e) => setPassword(e.target.value)}></textarea>
                    </ul>
                    <ul> Email: 
                        <textarea value = {email}onChange = {(e) => setEmail(e.target.value)}></textarea>
                    </ul>
                <button>signup</button>
            </div>

        )    
    
    case "true":
        return (
            <div style = {{textAlign : "center"}}>
                <ul> Username: 
                    <textarea value = {username} onChange = {(e) => setUsername(e.target.value)}></textarea>
                </ul>
                <ul> Password: 
                    <textarea value = {password} onChange = {(e) => setPassword(e.target.value)}></textarea>
                </ul>
            </div>
        )

    case "": 
        return (

            <div style = {{textAlign: "center"}}>
                <h2>User Profile Creation</h2>
                    
                       <button onClick = {() => {
                            setUsers("false")
                       }}>New User</button>
                    
                
                       <button onClick = {() => {
                            setUsers("true")
                       }}>User Login</button>
                    
                
            </div>

        )
    
    
}}

export default Loginscreen