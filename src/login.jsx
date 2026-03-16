import {useState} from "react"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const auth = getAuth()


function Loginscreen() {
    let [username, setUsername] = useState(""); 
    let [password, setPassword] = useState("");
    let [email, setEmail] = useState("");
    let [users, setUsers] = useState("");

  const signup = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth,email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
        username: username,
        email: email,
        createdAT: serverTimestamp()
    })
    alert("User created! Check your Firebase console.");
  }

  let login = async (email, password) => {
    await signInWithEmailAndPassword(auth,email,password);
    alert("User created! Check your Firebase console.");
  };
    
   
    switch(users){

    case "false":
        return (

            <div style = {{textAlign: "center"}}>
                <h2>User Profile Creation</h2>
                    <ul> Username: 
                        <input value = {username} onChange = {(e) => setUsername(e.target.value)}/>
                    </ul>
                    <ul> Password: 
                        <input value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                    </ul>
                    <ul> Email: 
                        <input value = {email}onChange = {(e) => setEmail(e.target.value)}/>
                    </ul>
                <button onClick = {() => signup(email, password, username)}>signup</button>
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
                <button OnClick = {() => login(username,password)}></button>
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