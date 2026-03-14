import {useState} from "react"


function Loginscreen() {
    var [username, setUsername] = useState(""); 
    var [password, setPassword] = useState("");
    var [email, setEmail] = useState("");
    // var [users, setUsers] = useState([]);


    // const addUsers() = async(){
    // user setup to db
    // }

    return (

            <div style = {{textAlign: "center"}}>
                <h2>User Profile Creation</h2>
                    <ul>
                        <textarea value = {username} onChange = {(e) => setUsername(e.target.value)}> UserName</textarea>
                    </ul>
                    <ul>
                        <textarea value = {password} onChange = {(e) => setPassword(e.target.value)}> password</textarea>
                    </ul>
                    <ul>
                        <textarea value = {email}onChange = {(e) => setEmail(e.target.value)}> email</textarea>
                    </ul>
                <button>signup</button>
            </div>

        )
        
    
}

export default Loginscreen